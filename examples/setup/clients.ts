// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  page,
  requireClient,
  requireDomain,
  requireDomainId,
  requireGroup,
  requireId,
  requireToken,
  runRoleLifecycle,
  runStep,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Clients scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureCore(context, { domainCount: 1, perDomainCount: 2 });

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const clientId = requireId(client.data, "client");
  const group = requireGroup(domain);
  const groupId = requireId(group, "group");
  const userId = state.user?.data.id;

  await tryStep(logger, "clients.get", () => sdk.Clients.get(clientId, domainId, token, true));
  await tryStep(logger, "clients.list", () => sdk.Clients.list(page, domainId, token));
  const bulk = await tryStep(logger, "clients.createBulk", () => sdk.Clients.createBulk(
    [
      { name: "setup-bulk-client-1" },
      { name: "setup-bulk-client-2" },
    ],
    domainId,
    token
  ));
  await tryStep(logger, "clients.update", () => sdk.Clients.update(
    {
      id: clientId,
      name: `${client.data.name}-updated`,
      metadata: { run_id: config.runId },
    },
    domainId,
    token
  ));
  const updatedSecret = `${client.secret}-updated`;
  await tryStep(logger, "clients.updateSecret", () => sdk.Clients.updateSecret(
    {
      id: clientId,
      credentials: { secret: updatedSecret },
    },
    domainId,
    token
  ));
  client.secret = updatedSecret;
  client.data.credentials = {
    ...client.data.credentials,
    secret: updatedSecret,
  };
  await tryStep(logger, "clients.updateTags", () => sdk.Clients.updateTags(
    { id: clientId, tags: ["setup", config.runId] },
    domainId,
    token
  ));
  await tryStep(logger, "clients.disable", () => sdk.Clients.disable(clientId, domainId, token));
  await tryStep(logger, "clients.enable", () => sdk.Clients.enable(clientId, domainId, token));
  await tryStep(logger, "clients.deleteParentGroup", () => sdk.Clients.deleteParentGroup(domainId, clientId, token));
  await tryStep(logger, "clients.setParentGroup.restore", () => sdk.Clients.setParentGroup(domainId, clientId, groupId, token));

  await runRoleLifecycle(logger, {
    label: "clients",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Clients.listActions(domainId, token),
    createRole: (roleName) => sdk.Clients.createRole(clientId, roleName, domainId, token),
    listRoles: () => sdk.Clients.listRoles(clientId, domainId, page, token),
    getRole: (roleId) => sdk.Clients.getRole(clientId, domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Clients.updateRole(clientId, domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Clients.addRoleActions(clientId, domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Clients.listRoleActions(clientId, domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Clients.deleteRoleActions(clientId, domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Clients.deleteAllRoleActions(clientId, domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Clients.addRoleMembers(clientId, domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Clients.listRoleMembers(clientId, domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Clients.deleteRoleMembers(clientId, domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Clients.deleteAllRoleMembers(clientId, domainId, roleId, token),
    listMembers: () => sdk.Clients.listMembers(clientId, domainId, page, token),
    deleteRole: (roleId) => sdk.Clients.deleteRole(clientId, domainId, roleId, token),
  });

  if (config.destructive) {
    const bulkClients = bulk && "clients" in bulk ? bulk.clients : [];
    for (const created of bulkClients) {
      if (created.id) {
        await runStep(logger, `clients.delete.${created.id}`, () => sdk.Clients.delete(created.id as string, domainId, token));
      }
    }
  } else {
    logger.skipped("clients.delete", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
