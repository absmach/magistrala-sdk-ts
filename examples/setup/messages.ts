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
  requireId,
  requireToken,
  sendSenmlMessages,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Messages scenario");
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
  const channelId = requireId(channel, "channel");

  await sendSenmlMessages(context, domain, client, channel);
  await tryStep(logger, "messages.read.filtered", () => sdk.Messages.read(
    domainId,
    channelId,
    {
      ...page,
      protocol: "http",
      publisher: requireId(client.data, "client"),
      name: "temperature",
    },
    token
  ));

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
