// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureMessaging,
  page,
  requireChannel,
  requireClient,
  requireDomain,
  requireDomainId,
  requireToken,
  sendSenmlMessages,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Alarms scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureMessaging(context, 1);

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const channel = requireChannel(domain);

  await sendSenmlMessages(context, domain, client, channel, true);
  const alarms = await tryStep(logger, "alarms.list", () => sdk.Alarms.list(domainId, page, token));
  const alarm = alarms?.alarms[0];
  if (alarm) {
    state.alarms.push(alarm);
    const viewed = await tryStep(logger, "alarms.view", () => sdk.Alarms.view(domainId, alarm.id as string, token));
    if (viewed) {
      state.alarms[0] = viewed;
    }
    const updated = await tryStep(logger, "alarms.update", () => sdk.Alarms.update(
      domainId,
      {
        ...alarm,
        status: "cleared",
        metadata: {
          run_id: config.runId,
          source: "examples/setup",
        },
      },
      token
    ));
    if (updated) {
      state.alarms[0] = updated;
    }
    if (config.destructive) {
      await tryStep(logger, "alarms.delete", () => sdk.Alarms.delete(domainId, alarm.id as string, token));
    } else {
      logger.skipped("alarms.delete", "set MG_RUN_DESTRUCTIVE=true");
    }
  } else {
    logger.skipped("alarms.view", "no alarm returned from list");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
