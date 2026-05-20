// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-param-reassign, no-restricted-syntax, import/prefer-default-export */

import SDK, {
  type Channel,
  type Client,
  type Domain,
  type Group,
  type Aggregation,
  type Format,
  type OutputType,
  type PAT,
  type ReportConfig,
  type Role,
  type Rule,
  type Token,
} from "../../src/sdk";
import type { SetupConfig } from "./config";
import type { SetupLogger } from "./logger";
import {
  type DomainResources,
  type SetupState,
  type StoredClient,
  type UserResources,
  saveState,
} from "./state";

export interface CoreOptions {
  domainCount: number;
  perDomainCount: number;
}

export interface ScenarioContext {
  config: SetupConfig;
  sdk: SDK;
  state: SetupState;
  logger: SetupLogger;
}

export const page = { offset: 0, limit: 10 };

export const sampleMessageNames = ["temperature", "voltage"];

const messageSampleCount = 50;

const safe = (value: string): string => value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

const stateSuffix = (state: SetupState): string => state.createdAt.replace(/[-:.TZ]/g, "").slice(0, 14);

export const prefixFor = (config: SetupConfig, state: SetupState): string => safe(`setup-${config.runId}-${stateSuffix(state)}`).slice(0, 48);

const shouldAdoptExisting = (): boolean => process.env.MG_SETUP_ADOPT_EXISTING === "true";

const namePool = [
  ["John", "Doe"],
  ["Jane", "Stone"],
  ["Maya", "Cole"],
  ["Noah", "Reed"],
  ["Ava", "Lane"],
  ["Leo", "Grant"],
];

const stableNumber = (value: string): number => value
  .split("")
  .reduce((total, char) => total + char.charCodeAt(0), 0);

const digitsOnly = (value: string): string => value.replace(/[^a-z0-9]/gi, "").toLowerCase();

const createGeneratedUserIdentity = (
  config: SetupConfig,
  state: SetupState,
  suffix: "primary" | "secondary"
) => {
  const nameIndex = stableNumber(`${config.runId}-${suffix}`) % namePool.length;
  const [firstName, lastName] = namePool[nameIndex];
  const uniquePart = digitsOnly(`${config.runId}${stateSuffix(state)}${suffix}`).slice(-18);
  const username = `${firstName[0]}${lastName}${uniquePart}`.toLowerCase();

  return {
    firstName,
    lastName,
    username,
    email: `${username}@example.com`,
    password: `Mg${uniquePart}${suffix}Secret1`,
  };
};

export const requireId = (
  resource: { id?: string },
  label: string
): string => {
  if (!resource.id) {
    throw new Error(`${label} response did not include an id`);
  }
  return resource.id;
};

export const requireToken = (state: SetupState): Token => {
  if (!state.user?.token) {
    throw new Error("Run the core setup first; no user token is available");
  }
  return state.user.token;
};

export const requireDomain = (
  state: SetupState,
  index = 0
): DomainResources => {
  const domain = state.domains[index];
  if (!domain) {
    throw new Error("Run the core setup first; no domain is available");
  }
  return domain;
};

export const requireDomainId = (domain: DomainResources): string => requireId(domain.data, "domain");

export const requireGroup = (
  domain: DomainResources,
  index = 0
): Group => {
  const group = domain.groups[index];
  if (!group) {
    throw new Error("Run the core setup first; no group is available");
  }
  return group;
};

export const requireClient = (
  domain: DomainResources,
  index = 0
): StoredClient => {
  const client = domain.clients[index];
  if (!client) {
    throw new Error("Run the core setup first; no client is available");
  }
  return client;
};

export const requireChannel = (
  domain: DomainResources,
  index = 0
): Channel => {
  const channel = domain.channels[index];
  if (!channel) {
    throw new Error("Run the core setup first; no channel is available");
  }
  return channel;
};

export const runStep = async <T>(
  logger: SetupLogger,
  label: string,
  fn: () => Promise<T>
): Promise<T> => {
  logger.info(`- ${label}`);
  const value = await fn();
  logger.resource(label, value);
  return value;
};

export const tryStep = async <T>(
  logger: SetupLogger,
  label: string,
  fn: () => Promise<T>
): Promise<T | undefined> => {
  try {
    return await runStep(logger, label, fn);
  } catch (error) {
    logger.error(label, error);
    return undefined;
  }
};

const sleep = (milliseconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const isTransportFailure = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const cause = "cause" in error ? error.cause : undefined;
  return error.message === "fetch failed" || (
    cause instanceof Error && cause.message.includes("other side closed")
  );
};

const toStoredClient = (client: Client): StoredClient => {
  const secret = client.credentials?.secret;
  if (!secret) {
    throw new Error("Client response did not include credentials.secret");
  }
  const identity = client.credentials?.identity ?? client.identity;

  return {
    data: {
      ...client,
      identity,
      credentials: {
        ...client.credentials,
        ...(identity ? { identity } : {}),
        secret,
      },
    },
    identity,
    secret,
  };
};

const refreshUserResources = async (
  context: ScenarioContext,
  label: "user" | "secondaryUser",
  resources: UserResources
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  try {
    const token = await runStep(logger, `${label}.token.refresh`, () => sdk.Users.refreshToken(resources.token.refresh_token));
    resources.token = token;
  } catch (error) {
    logger.error(`${label}.token.refresh`, error);
    const token = await runStep(logger, `${label}.token.issue`, () => sdk.Users.createToken({
      username: resources.credentials.username,
      password: resources.credentials.password,
    }));
    resources.token = token;
  }

  saveState(config, state);
};

const createUserResources = async (
  context: ScenarioContext,
  label: "user" | "secondaryUser"
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  const existing = label === "user" ? state.user : state.secondaryUser;
  if (existing) {
    logger.skipped(label, "already present in run state; refreshing token");
    await refreshUserResources(context, label, existing);
    return;
  }

  const suffix = label === "user" ? "primary" : "secondary";
  const identity = createGeneratedUserIdentity(config, state, suffix);
  const user = await runStep(logger, `${label}.create`, () => sdk.Users.create({
    first_name: identity.firstName,
    last_name: identity.lastName,
    email: identity.email,
    credentials: {
      username: identity.username,
      secret: identity.password,
    },
    metadata: {
      run_id: config.runId,
      source: "examples/setup",
    },
  }));
  const token = await runStep(logger, `${label}.token`, () => sdk.Users.createToken({
    username: identity.username,
    password: identity.password,
  }));
  const resources = {
    data: user,
    credentials: {
      username: identity.username,
      password: identity.password,
      email: identity.email,
    },
    token,
  };

  if (label === "user") {
    state.user = resources;
  } else {
    state.secondaryUser = resources;
  }
  saveState(config, state);
};

export const ensureUserAndToken = async (
  context: ScenarioContext
): Promise<void> => createUserResources(context, "user");

export const ensureSecondaryUserAndToken = async (
  context: ScenarioContext
): Promise<void> => createUserResources(context, "secondaryUser");

const emptyDomainResources = (domain: Domain): DomainResources => ({
  data: domain,
  groups: [],
  clients: [],
  channels: [],
  connections: [],
  messages: [],
  reportConfigs: [],
  reports: [],
});

const findDomainByName = async (
  context: ScenarioContext,
  name: string
): Promise<Domain | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domains = await tryStep(logger, `domain.${name}.lookup`, () => sdk.Domains.list({
    ...page,
    name,
  }, token));
  return (domains?.domains ?? []).find((domain) => domain.name === name || domain.route === name);
};

const findGroupByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<Group | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const groups = await tryStep(logger, `group.${name}.lookup`, () => sdk.Groups.list({
    ...page,
    name,
  }, domainId, token));
  return (groups?.groups ?? []).find((group) => group.name === name);
};

const findClientByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<StoredClient | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const clients = await tryStep(logger, `client.${name}.lookup`, () => sdk.Clients.list({
    ...page,
    name,
  }, domainId, token));
  const client = (clients?.clients ?? []).find((item) => item.name === name);
  if (!client) {
    return undefined;
  }

  return toStoredClient(client);
};

const findChannelByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<Channel | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const channels = await tryStep(logger, `channel.${name}.lookup`, () => sdk.Channels.list({
    ...page,
    name,
  }, domainId, token));
  return (channels?.channels ?? []).find((channel) => channel.name === name);
};

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

const findReportConfigByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<ReportConfig | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const configs = await tryStep(logger, `reportConfig.${name}.lookup`, () => sdk.Reports.listConfigs(
    domainId,
    {
      offset: 0,
      limit: 100,
    },
    token
  ));
  return (configs?.report_configs ?? []).find((config) => config.name === name);
};

export const createDomain = async (
  context: ScenarioContext,
  index: number
): Promise<DomainResources> => {
  const { config, sdk, state, logger } = context;
  const prefix = prefixFor(config, state);
  const token = requireToken(state).access_token;
  const name = `${prefix}-domain-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findDomainByName(context, name);
    if (existing) {
      logger.resource(`domain.${index}.adopt`, existing);
      const resources = emptyDomainResources(existing);
      state.domains.push(resources);
      saveState(config, state);
      return resources;
    }
  }

  const domain = await runStep(logger, `domain.${index}.create`, () => sdk.Domains.create(
    {
      name,
      route: name,
      tags: ["setup", config.runId],
      metadata: {
        run_id: config.runId,
        source: "examples/setup",
      },
    },
    token
  ));
  const resources = emptyDomainResources(domain);
  state.domains.push(resources);
  saveState(config, state);
  return resources;
};

export const createGroup = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<Group> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-group-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findGroupByName(context, domainId, name);
    if (existing) {
      logger.resource(`group.${index}.adopt`, existing);
      domain.groups.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const group = await runStep(logger, `group.${index}.create`, () => sdk.Groups.create(
      {
        name,
        description: `Setup group ${index + 1}`,
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    domain.groups.push(group);
    saveState(config, state);
    return group;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`group.${index}.create`, error);
    await sleep(1000);
    const recovered = await findGroupByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`group.${index}.recover`, recovered);
    domain.groups.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const createClient = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<StoredClient> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-client-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findClientByName(context, domainId, name);
    if (existing) {
      logger.resource(`client.${index}.adopt`, existing);
      domain.clients.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const client = await runStep(logger, `client.${index}.create`, () => sdk.Clients.create(
      {
        name,
        tags: ["setup", config.runId],
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    const storedClient = toStoredClient(client);
    domain.clients.push(storedClient);
    saveState(config, state);
    return storedClient;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`client.${index}.create`, error);
    await sleep(1000);
    const recovered = await findClientByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`client.${index}.recover`, recovered);
    domain.clients.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const createChannel = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<Channel> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-channel-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findChannelByName(context, domainId, name);
    if (existing) {
      logger.resource(`channel.${index}.adopt`, existing);
      domain.channels.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const channel = await runStep(logger, `channel.${index}.create`, () => sdk.Channels.create(
      {
        name,
        tags: ["setup", config.runId],
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    domain.channels.push(channel);
    saveState(config, state);
    return channel;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`channel.${index}.create`, error);
    await sleep(1000);
    const recovered = await findChannelByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`channel.${index}.recover`, recovered);
    domain.channels.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const connectClientToChannel = async (
  context: ScenarioContext,
  domain: DomainResources,
  client: StoredClient,
  channel: Channel,
  group?: Group
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const clientId = requireId(client.data, "client");
  const channelId = requireId(channel, "channel");
  const groupId = group?.id;
  const existing = domain.connections.some(
    (connection) => connection.clientId === clientId && connection.channelId === channelId
  );
  if (existing) {
    logger.skipped(`connection.${clientId}.${channelId}`, "already present in run state");
    return;
  }

  if (groupId) {
    await runStep(logger, `client.${clientId}.setParentGroup`, () => sdk.Clients.setParentGroup(domainId, clientId, groupId, token));
    await runStep(logger, `channel.${channelId}.setParentGroup`, () => sdk.Channels.setParentGroup(domainId, channelId, groupId, token));
  }

  await runStep(logger, `channel.${channelId}.connectClient`, () => sdk.Channels.connectClient(
    [clientId],
    channelId,
    ["publish", "subscribe"],
    domainId,
    token
  ));
  domain.connections.push({
    clientId,
    channelId,
    groupId,
    types: ["publish", "subscribe"],
  });
  saveState(config, state);
};

export const ensureCore = async (
  context: ScenarioContext,
  options: CoreOptions
): Promise<void> => {
  const { config, state, logger } = context;
  logger.section("Core setup");
  await ensureUserAndToken(context);

  while (state.domains.length < options.domainCount) {
    await createDomain(context, state.domains.length);
  }

  for (const domain of state.domains.slice(0, options.domainCount)) {
    const domainId = requireDomainId(domain);
    logger.section(`Domain ${domainId}`);
    while (domain.groups.length < options.perDomainCount) {
      await createGroup(context, domain, domain.groups.length);
    }
    while (domain.clients.length < options.perDomainCount) {
      await createClient(context, domain, domain.clients.length);
    }
    while (domain.channels.length < options.perDomainCount) {
      await createChannel(context, domain, domain.channels.length);
    }

    for (let index = 0; index < options.perDomainCount; index += 1) {
      await connectClientToChannel(
        context,
        domain,
        domain.clients[index],
        domain.channels[index],
        domain.groups[index]
      );
    }
  }

  logger.resource("core.state.saved", {
    run_id: config.runId,
    domains: state.domains.length,
  });
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

export const createPat = async (
  context: ScenarioContext,
  index: number
): Promise<PAT> => {
  const { config, sdk, state, logger } = context;
  const existing = state.pats[index];
  if (existing) {
    logger.skipped(`pat.${index}`, "already present in run state");
    return existing;
  }

  const token = requireToken(state).access_token;
  const pat = await runStep(logger, `pat.${index}.create`, () => sdk.PATs.create(
    `${prefixFor(config, state)}-pat-${index + 1}`,
    "24h",
    token,
    "Created by examples/setup"
  ));
  state.pats.push(pat);
  saveState(config, state);
  return pat;
};

export const createReportConfig = async (
  context: ScenarioContext,
  domain: DomainResources,
  client: StoredClient,
  channel: Channel,
  index: number
): Promise<ReportConfig> => {
  const { config, sdk, state, logger } = context;
  const existing = domain.reportConfigs[index];
  if (existing) {
    logger.skipped(`reportConfig.${index}`, "already present in run state");
    return existing;
  }

  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-report-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existingConfig = await findReportConfigByName(context, domainId, name);
    if (existingConfig) {
      logger.resource(`reportConfig.${index}.adopt`, existingConfig);
      domain.reportConfigs.push(existingConfig);
      saveState(config, state);
      return existingConfig;
    }
  }

  const reportConfig: ReportConfig = {
    name,
    description: "Created by examples/setup",
    config: {
      title: `Setup Report ${index + 1}`,
      from: "now()-1h",
      to: "now()",
      aggregation: {
        agg_type: "none" as Aggregation,
        interval: "1m",
      },
      file_format: "csv" as Format,
      timezone: "UTC",
    },
    metrics: [
      {
        name: sampleMessageNames[index % sampleMessageNames.length],
        channel_id: requireId(channel, "channel"),
        client_ids: [requireId(client.data, "client")],
        subtopic: "",
        protocol: "http",
        format: "",
      },
    ],
    email: {
      to: [state.user?.credentials.email ?? "user@example.com"],
      subject: `Setup report ${index + 1}`,
      content: "Report generated by examples/setup",
    },
  };

  try {
    const created = await runStep(logger, `reportConfig.${index}.add`, () => sdk.Reports.addConfig(domainId, reportConfig, token));
    domain.reportConfigs.push(created);
    saveState(config, state);
    return created;
  } catch (error) {
    logger.error(`reportConfig.${index}.add`, error);
    if (isTransportFailure(error)) {
      await sleep(1000);
    }
    const recovered = await findReportConfigByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`reportConfig.${index}.recover`, recovered);
    domain.reportConfigs.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

interface RoleLifecycle {
  label: string;
  destructive: boolean;
  memberId?: string;
  listActions: () => Promise<string[]>;
  createRole: (roleName: string) => Promise<Role>;
  listRoles: () => Promise<unknown>;
  getRole: (roleId: string) => Promise<unknown>;
  updateRole: (roleId: string, role: Role) => Promise<unknown>;
  addRoleActions: (roleId: string, actions: string[]) => Promise<unknown>;
  listRoleActions: (roleId: string) => Promise<unknown>;
  deleteRoleActions: (roleId: string, actions: string[]) => Promise<unknown>;
  deleteAllRoleActions: (roleId: string) => Promise<unknown>;
  addRoleMembers: (roleId: string, members: string[]) => Promise<unknown>;
  listRoleMembers: (roleId: string) => Promise<unknown>;
  deleteRoleMembers: (roleId: string, members: string[]) => Promise<unknown>;
  deleteAllRoleMembers: (roleId: string) => Promise<unknown>;
  listMembers: () => Promise<unknown>;
  deleteRole: (roleId: string) => Promise<unknown>;
}

export const runRoleLifecycle = async (
  logger: SetupLogger,
  lifecycle: RoleLifecycle
): Promise<void> => {
  const actions = await tryStep(logger, `${lifecycle.label}.actions`, lifecycle.listActions);
  const role = await tryStep(logger, `${lifecycle.label}.role.create`, () => lifecycle.createRole(`${lifecycle.label}-setup-role`));
  await tryStep(logger, `${lifecycle.label}.roles.list`, lifecycle.listRoles);

  if (!role?.id) {
    logger.skipped(`${lifecycle.label}.role.detail`, "created role did not include an id");
    return;
  }

  await tryStep(logger, `${lifecycle.label}.role.get`, () => lifecycle.getRole(role.id as string));
  await tryStep(logger, `${lifecycle.label}.role.update`, () => lifecycle.updateRole(role.id as string, {
    name: `${lifecycle.label}-setup-role-updated`,
  }));

  const action = actions?.[0];
  if (action) {
    await tryStep(logger, `${lifecycle.label}.role.actions.add`, () => lifecycle.addRoleActions(role.id as string, [action]));
    await tryStep(logger, `${lifecycle.label}.role.actions.list`, () => lifecycle.listRoleActions(role.id as string));
  } else {
    logger.skipped(`${lifecycle.label}.role.actions`, "no available actions returned");
  }

  if (lifecycle.memberId) {
    await tryStep(logger, `${lifecycle.label}.role.members.add`, () => lifecycle.addRoleMembers(role.id as string, [lifecycle.memberId as string]));
    await tryStep(logger, `${lifecycle.label}.role.members.list`, () => lifecycle.listRoleMembers(role.id as string));
  } else {
    logger.skipped(`${lifecycle.label}.role.members`, "no member id available");
  }
  await tryStep(logger, `${lifecycle.label}.members.list`, lifecycle.listMembers);

  if (!lifecycle.destructive) {
    logger.skipped(`${lifecycle.label}.role.cleanup`, "set MG_RUN_DESTRUCTIVE=true");
    return;
  }

  if (action) {
    await tryStep(logger, `${lifecycle.label}.role.actions.delete`, () => lifecycle.deleteRoleActions(role.id as string, [action]));
  }
  await tryStep(logger, `${lifecycle.label}.role.actions.deleteAll`, () => lifecycle.deleteAllRoleActions(role.id as string));
  if (lifecycle.memberId) {
    await tryStep(logger, `${lifecycle.label}.role.members.delete`, () => lifecycle.deleteRoleMembers(role.id as string, [lifecycle.memberId as string]));
  }
  await tryStep(logger, `${lifecycle.label}.role.members.deleteAll`, () => lifecycle.deleteAllRoleMembers(role.id as string));
  await tryStep(logger, `${lifecycle.label}.role.delete`, () => lifecycle.deleteRole(role.id as string));
};
