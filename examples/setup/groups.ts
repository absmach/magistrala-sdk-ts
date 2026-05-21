// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  page,
  requireDomain,
  requireDomainId,
  requireGroup,
  requireId,
  requireToken,
  runRoleLifecycle,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Groups scenario");
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
  const group = requireGroup(domain);
  const child = requireGroup(domain, 1);
  const groupId = requireId(group, "group");
  const childId = requireId(child, "child group");
  const userId = state.user?.data.id;

  await tryStep(logger, "groups.get", () => sdk.Groups.get(groupId, domainId, token, true));
  await tryStep(logger, "groups.list", () => sdk.Groups.list(page, domainId, token));
  await tryStep(logger, "groups.update", () => sdk.Groups.update(
    {
      id: groupId,
      name: `${group.name}-updated`,
      description: "Updated by examples/setup",
      metadata: { run_id: config.runId },
    },
    domainId,
    token
  ));
  await tryStep(logger, "groups.updateTags", () => sdk.Groups.updateTags(
    { id: groupId, tags: ["setup", config.runId] },
    domainId,
    token
  ));
  await tryStep(logger, "groups.disable", () => sdk.Groups.disable(groupId, domainId, token));
  await tryStep(logger, "groups.enable", () => sdk.Groups.enable(groupId, domainId, token));
  await tryStep(logger, "groups.removeParent.initial", () => sdk.Groups.removeParent(childId, domainId, token));
  await tryStep(logger, "groups.addParent", () => sdk.Groups.addParent(childId, domainId, groupId, token));
  await tryStep(logger, "groups.getHierarchy", () => sdk.Groups.getHierarchy(groupId, domainId, { direction: -1 }, token));
  await tryStep(logger, "groups.listChildren", () => sdk.Groups.listChildren(groupId, domainId, page, token));
  await tryStep(logger, "groups.removeParent", () => sdk.Groups.removeParent(childId, domainId, token));
  await tryStep(logger, "groups.addChildren", () => sdk.Groups.addChildren(groupId, domainId, [childId], token));
  await tryStep(logger, "groups.removeChildren", () => sdk.Groups.removeChildren(groupId, domainId, [childId], token));
  await tryStep(logger, "groups.addChildren.restore", () => sdk.Groups.addChildren(groupId, domainId, [childId], token));

  await runRoleLifecycle(logger, {
    label: "groups",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Groups.listActions(domainId, token),
    createRole: (roleName) => sdk.Groups.createRole(groupId, domainId, roleName, token),
    listRoles: () => sdk.Groups.listRoles(groupId, domainId, page, token),
    getRole: (roleId) => sdk.Groups.getRole(groupId, domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Groups.updateRole(groupId, domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Groups.addRoleActions(groupId, domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Groups.listRoleActions(groupId, domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Groups.deleteRoleActions(groupId, domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Groups.deleteAllRoleActions(groupId, domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Groups.addRoleMembers(groupId, domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Groups.listRoleMembers(groupId, domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Groups.deleteRoleMembers(groupId, domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Groups.deleteAllRoleMembers(groupId, domainId, roleId, token),
    listMembers: () => sdk.Groups.listMembers(groupId, domainId, page, token),
    deleteRole: (roleId) => sdk.Groups.deleteRole(groupId, domainId, roleId, token),
  });

  if (config.destructive) {
    await tryStep(logger, "groups.removeAllChildren", () => sdk.Groups.removeAllChildren(groupId, domainId, token));
    await tryStep(logger, "groups.delete.child", () => sdk.Groups.delete(childId, domainId, token));
  } else {
    logger.skipped("groups.removeAllChildren", "set MG_RUN_DESTRUCTIVE=true");
    logger.skipped("groups.delete", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
