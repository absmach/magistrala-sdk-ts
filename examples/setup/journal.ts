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
  requireGroup,
  requireId,
  requireToken,
  runStep,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Journal scenario");
  const {
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
  const group = requireGroup(domain);
  const userId = state.user?.data.id;

  try {
    await runStep(logger, "journal.client", () => sdk.Journal.listByEntity(
      "client",
      requireId(client.data, "client"),
      domainId,
      page,
      token
    ));
  } catch (error) {
    logger.error("journal.client", error);
    await tryStep(logger, "journal.client.retry", () => sdk.Journal.listByEntity(
      "client",
      requireId(client.data, "client"),
      domainId,
      page,
      token
    ));
  }
  await tryStep(logger, "journal.channel", () => sdk.Journal.listByEntity(
    "channel",
    requireId(channel, "channel"),
    domainId,
    page,
    token
  ));
  await tryStep(logger, "journal.group", () => sdk.Journal.listByEntity(
    "group",
    requireId(group, "group"),
    domainId,
    page,
    token
  ));
  if (userId) {
    const userJournal = await tryStep(logger, "journal.user", () => sdk.Journal.listByUser(userId, page, token));
    if (!userJournal) {
      logger.skipped("journal.user", "not authorized by local policy");
    }
  }
  await tryStep(logger, "journal.clientTelemetry", () => sdk.Journal.clientTelemetry(requireId(client.data, "client"), domainId, token));

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
