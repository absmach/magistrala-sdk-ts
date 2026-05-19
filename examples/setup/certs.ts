// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  requireClient,
  requireDomain,
  requireDomainId,
  requireId,
  requireToken,
  runStep,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Certs scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureCore(context, { domainCount: 1, perDomainCount: 1 });

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const clientId = requireId(client.data, "client");

  const cert = await tryStep(logger, "certs.issue", () => sdk.Certs.issue(clientId, "24h", domainId, token));
  if (cert) {
    state.certs.push(cert);
  }
  const certs = await tryStep(logger, "certs.listByClient", () => sdk.Certs.listByClient(clientId, domainId, token));
  const certId = cert?.cert_serial ?? certs?.certs[0]?.cert_serial;
  if (certId) {
    await tryStep(logger, "certs.get", () => sdk.Certs.get(certId, domainId, token));
    if (config.destructive) {
      await runStep(logger, "certs.revoke", () => sdk.Certs.revoke(certId, domainId, token));
    } else {
      logger.skipped("certs.revoke", "set MG_RUN_DESTRUCTIVE=true");
    }
  } else {
    logger.skipped("certs.get", "no cert serial returned");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
