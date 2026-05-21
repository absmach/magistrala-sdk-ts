// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-param-reassign, no-restricted-syntax */

import {
  type Channel,
  type OutputType,
  type Rule,
} from "../../../src/sdk";
import type { DomainResources, StoredClient } from "../state";
import { saveState } from "../state";
import {
  type ScenarioContext,
  isTransportFailure,
  messageSampleCount,
  page,
  prefixFor,
  requireChannel,
  requireClient,
  requireDomainId,
  requireId,
  requireToken,
  runStep,
  sampleMessageNames,
  shouldAdoptExisting,
  sleep,
  tryStep,
} from "./common";
import { ensureCore } from "./provisioning";

const findRuleByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<Rule | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const rules = await tryStep(logger, `rule.${name}.lookup`, () => sdk.Rules.list(
    domainId,
    {
      ...page,
      name,
    },
    token
  ));
  return (rules?.rules ?? []).find((rule) => rule.name === name);
};

export const saveSenmlLua = [
  "function logicFunction()",
  "  return message.payload",
  "end",
  "return logicFunction()",
].join("\n");

export const alarmLua = [
  "function logicFunction()",
  "  local results = {}",
  "  local threshold = 80",
  "  for _, msg in ipairs(message.payload) do",
  "    local value = msg.v",
  "    if value ~= nil and value >= threshold then",
  "      table.insert(results, {",
  "        measurement = msg.n,",
  "        value = tostring(value),",
  "        threshold = tostring(threshold),",
  "        cause = \"Threshold reached\",",
  "        unit = msg.u,",
  "        severity = 3,",
  "      })",
  "    end",
  "  end",
  "  return results",
  "end",
  "return logicFunction()",
].join("\n");

export const createSaveSenmlRule = async (
  context: ScenarioContext,
  domain: DomainResources,
  channel: Channel
): Promise<Rule> => {
  const { config, sdk, state, logger } = context;
  if (domain.saveRule) {
    logger.skipped("rule.save_senml", "already present in run state");
    return domain.saveRule;
  }

  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-save-senml`;
  if (shouldAdoptExisting()) {
    const existing = await findRuleByName(context, domainId, name);
    if (existing) {
      logger.resource("rule.save_senml.adopt", existing);
      domain.saveRule = existing;
      saveState(config, state);
      return existing;
    }
  }

  try {
    const rule = await runStep(logger, "rule.save_senml.create", () => sdk.Rules.create(
      domainId,
      {
        name,
        input_channel: requireId(channel, "channel"),
        input_topic: "",
        logic: {
          type: 0,
          value: saveSenmlLua,
        },
        outputs: [{ type: "save_senml" as OutputType }],
        tags: ["setup", "save_senml"],
        metadata: {
          run_id: config.runId,
        },
      },
      token
    ));
    domain.saveRule = rule;
    saveState(config, state);
    return rule;
  } catch (error) {
    logger.error("rule.save_senml.create", error);
    if (isTransportFailure(error)) {
      await sleep(1000);
    }
    const recovered = await findRuleByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource("rule.save_senml.recover", recovered);
    domain.saveRule = recovered;
    saveState(config, state);
    return recovered;
  }
};

export const createAlarmRule = async (
  context: ScenarioContext,
  domain: DomainResources,
  channel: Channel
): Promise<Rule> => {
  const { config, sdk, state, logger } = context;
  if (domain.alarmRule) {
    logger.skipped("rule.alarm", "already present in run state");
    return domain.alarmRule;
  }

  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-alarm`;
  if (shouldAdoptExisting()) {
    const existing = await findRuleByName(context, domainId, name);
    if (existing) {
      logger.resource("rule.alarm.adopt", existing);
      domain.alarmRule = existing;
      saveState(config, state);
      return existing;
    }
  }

  try {
    const rule = await runStep(logger, "rule.alarm.create", () => sdk.Rules.create(
      domainId,
      {
        name,
        input_channel: requireId(channel, "channel"),
        input_topic: "",
        logic: {
          type: 0,
          value: alarmLua,
        },
        outputs: [{ type: "alarms" as OutputType }],
        tags: ["setup", "alarm"],
        metadata: {
          run_id: config.runId,
        },
      },
      token
    ));
    domain.alarmRule = rule;
    saveState(config, state);
    return rule;
  } catch (error) {
    logger.error("rule.alarm.create", error);
    if (isTransportFailure(error)) {
      await sleep(1000);
    }
    const recovered = await findRuleByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource("rule.alarm.recover", recovered);
    domain.alarmRule = recovered;
    saveState(config, state);
    return recovered;
  }
};

const messagePayload = (
  highValue = false,
  sampleCount = messageSampleCount
): Record<string, unknown>[] => {
  const baseTime = Math.floor(Date.now() / 1000) - ((sampleCount - 1) * 60);

  return Array.from({ length: sampleCount }).flatMap((_, index) => {
    const temperature = highValue && index === sampleCount - 1
      ? 95
      : Number((23.5 + Math.sin(index / 4) * 4 + index * 0.04).toFixed(2));
    const voltage = Number((119.8 + Math.cos(index / 5) * 1.6).toFixed(2));
    const timeOffset = index * 60;

    return [
      {
        ...(index === 0 ? { bn: "setup:", bt: baseTime } : { t: timeOffset }),
        n: "temperature",
        u: "C",
        v: temperature,
      },
      {
        t: timeOffset,
        n: "voltage",
        u: "V",
        v: voltage,
      },
    ];
  });
};

const countStoredValues = (
  domain: DomainResources,
  name: string
): number => domain.messages.reduce((total, message) => {
  try {
    const records = JSON.parse(message.payload) as Array<{ n?: string }>;
    if (!Array.isArray(records)) {
      return total;
    }
    return total + records.filter((record) => record.n === name).length;
  } catch {
    return total;
  }
}, 0);

export const sendSenmlMessages = async (
  context: ScenarioContext,
  domain: DomainResources,
  client: StoredClient,
  channel: Channel,
  highValue = false
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const channelId = requireId(channel, "channel");
  const clientId = requireId(client.data, "client");
  const topic = channelId;
  const records = messagePayload(highValue);
  const payload = JSON.stringify(records);

  await runStep(logger, "messages.send", () => sdk.Messages.send(domainId, topic, payload, client.secret));
  domain.messages.push({
    channelId,
    clientId,
    topic,
    payload,
    names: sampleMessageNames,
    recordCount: records.length,
    sampleCount: messageSampleCount,
  });
  saveState(config, state);

  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  await tryStep(logger, "messages.read", () => sdk.Messages.read(
    domainId,
    channelId,
    {
      ...page,
      protocol: "http",
    },
    token
  ));
};

export const ensureMessaging = async (
  context: ScenarioContext,
  domainCount = 3
): Promise<void> => {
  const { state, logger } = context;
  logger.section("Messaging setup");
  await ensureCore(context, { domainCount, perDomainCount: 5 });

  for (const domain of state.domains.slice(0, domainCount)) {
    const channel = requireChannel(domain);
    const client = requireClient(domain);
    await createSaveSenmlRule(context, domain, channel);
    await createAlarmRule(context, domain, channel);
    const hasEnoughMessages = sampleMessageNames.every((name) => (
      countStoredValues(domain, name) >= messageSampleCount
    ));
    if (!hasEnoughMessages) {
      await sendSenmlMessages(context, domain, client, channel, true);
    } else {
      logger.skipped("messages.send", "already present in run state");
    }
  }
};
