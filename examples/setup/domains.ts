// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  ensureSecondaryUserAndToken,
  page,
  requireDomain,
  requireDomainId,
  requireToken,
  runRoleLifecycle,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Domains scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureCore(context, { domainCount: 1, perDomainCount: 1 });
  await ensureSecondaryUserAndToken(context);

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const userId = state.user?.data.id;
  const secondaryUserId = state.secondaryUser?.data.id;

  await tryStep(logger, "domains.get", () => sdk.Domains.get(domainId, token, true));
  await tryStep(logger, "domains.list", () => sdk.Domains.list(page, token));
  if (userId) {
    await tryStep(logger, "domains.listByUser", () => sdk.Domains.listByUser(userId, page, token));
  }
  await tryStep(logger, "domains.update", () => sdk.Domains.update(
    {
      id: domainId,
      name: `${domain.data.name}-updated`,
      metadata: { run_id: config.runId },
    },
    token
  ));
  await tryStep(logger, "domains.disable", () => sdk.Domains.disable(domainId, token));
  await tryStep(logger, "domains.enable", () => sdk.Domains.enable(domainId, token));

  await runRoleLifecycle(logger, {
    label: "domains",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Domains.listActions(token),
    createRole: (roleName) => sdk.Domains.createRole(domainId, roleName, token),
    listRoles: () => sdk.Domains.listRoles(domainId, page, token),
    getRole: (roleId) => sdk.Domains.getRole(domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Domains.updateRole(domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Domains.addRoleActions(domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Domains.listRoleActions(domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Domains.deleteRoleActions(domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Domains.deleteAllRoleActions(domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Domains.addRoleMembers(domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Domains.listRoleMembers(domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Domains.deleteRoleMembers(domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Domains.deleteAllRoleMembers(domainId, roleId, token),
    listMembers: () => sdk.Domains.listMembers(domainId, page, token),
    deleteRole: (roleId) => sdk.Domains.deleteRole(domainId, roleId, token),
  });

  const inviteRole = await tryStep(logger, "domains.inviteRole.create", () => sdk.Domains.createRole(domainId, "setup-invitee", token));
  if (secondaryUserId && inviteRole?.id) {
    await tryStep(logger, "domains.sendInvitation", () => sdk.Domains.sendInvitation(
      secondaryUserId,
      domainId,
      inviteRole.id as string,
      token,
      false
    ));
    await tryStep(logger, "domains.getInvitation", () => sdk.Domains.getInvitation(secondaryUserId, domainId, token));
  }
  await tryStep(logger, "domains.listInvitations", () => sdk.Domains.listInvitations(page, domainId, token));
  await tryStep(logger, "domains.listUserInvitations", () => sdk.Domains.listUserInvitations(page, token));

  if (config.destructive) {
    await tryStep(logger, "domains.freeze", () => sdk.Domains.freeze(domainId, token));
  } else {
    logger.skipped("domains.freeze", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
