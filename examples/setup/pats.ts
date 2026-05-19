// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  createPat,
  ensureCore,
  page,
  requireClient,
  requireDomain,
  requireDomainId,
  requireId,
  requireToken,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("PATs scenario");
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
  const pat = await createPat(context, 0);
  await createPat(context, 1);

  if (!pat.id) {
    throw new Error("PAT response did not include an id");
  }

  await tryStep(logger, "pats.list", () => sdk.PATs.list(page, token));
  await tryStep(logger, "pats.get", () => sdk.PATs.get(pat.id as string, token));
  await tryStep(logger, "pats.updateName", () => sdk.PATs.updateName(`${pat.name}-updated`, pat.id as string, token));
  await tryStep(logger, "pats.updateDescription", () => sdk.PATs.updateDescription(
    "Updated by examples/setup",
    pat.id as string,
    token
  ));
  await tryStep(logger, "pats.addScope", () => sdk.PATs.addScope(
    [
      {
        domain_id: domainId,
        entity_type: "clients",
        entity_id: clientId,
        operation: "view",
      },
      {
        domain_id: domainId,
        entity_type: "channels",
        entity_id: "*",
        operation: "list",
      },
    ],
    pat.id as string,
    token
  ));
  const scopes = await tryStep(logger, "pats.listScopes", () => sdk.PATs.listScopes(pat.id as string, page, token));
  await tryStep(logger, "pats.resetSecret", () => sdk.PATs.resetSecret("24h", pat.id as string, token));

  if (config.destructive) {
    const scopeIds = scopes?.scopes
      .map((scope) => scope.id)
      .filter((scopeId): scopeId is string => Boolean(scopeId)) ?? [];
    if (scopeIds.length > 0) {
      await tryStep(logger, "pats.deleteScopes", () => sdk.PATs.deleteScopes(pat.id as string, scopeIds, token));
    }
    await tryStep(logger, "pats.deleteAllScopes", () => sdk.PATs.deleteAllScopes(pat.id as string, token));
    await tryStep(logger, "pats.revoke", () => sdk.PATs.revoke(pat.id as string, token));
    await tryStep(logger, "pats.delete", () => sdk.PATs.delete(pat.id as string, token));
    await tryStep(logger, "pats.deleteAll", () => sdk.PATs.deleteAll(token));
  } else {
    logger.skipped("pats.destructive", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
