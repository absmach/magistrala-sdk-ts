// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  page,
  requireChannel,
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
  const context = createScenarioContext("Channels scenario");
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
  const channel = requireChannel(domain);
  const channelId = requireId(channel, "channel");
  const group = requireGroup(domain);
  const groupId = requireId(group, "group");
  const userId = state.user?.data.id;

  await tryStep(logger, "channels.get", () => sdk.Channels.get(channelId, domainId, token, true));
  await tryStep(logger, "channels.list", () => sdk.Channels.list(page, domainId, token));
  const bulk = await tryStep(logger, "channels.createBulk", () => sdk.Channels.createBulk(
    [
      { name: "setup-bulk-channel-1" },
      { name: "setup-bulk-channel-2" },
    ],
    domainId,
    token
  ));
  await tryStep(logger, "channels.update", () => sdk.Channels.update(
    {
      id: channelId,
      name: `${channel.name}-updated`,
      metadata: { run_id: config.runId },
    },
    domainId,
    token
  ));
  await tryStep(logger, "channels.updateTags", () => sdk.Channels.updateTags(
    { id: channelId, tags: ["setup", config.runId] },
    domainId,
    token
  ));
  await tryStep(logger, "channels.disable", () => sdk.Channels.disable(channelId, domainId, token));
  await tryStep(logger, "channels.enable", () => sdk.Channels.enable(channelId, domainId, token));
  await tryStep(logger, "channels.disconnectClient", () => sdk.Channels.disconnectClient([clientId], channelId, ["subscribe"], domainId, token));
  await tryStep(logger, "channels.connectClient", () => sdk.Channels.connectClient([clientId], channelId, ["publish", "subscribe"], domainId, token));
  await tryStep(logger, "channels.disconnect", () => sdk.Channels.disconnect([clientId], [channelId], ["subscribe"], domainId, token));
  await tryStep(logger, "channels.connect", () => sdk.Channels.connect([clientId], [channelId], ["publish", "subscribe"], domainId, token));
  await tryStep(logger, "channels.deleteParentGroup", () => sdk.Channels.deleteParentGroup(domainId, channelId, token));
  await tryStep(logger, "channels.setParentGroup.restore", () => sdk.Channels.setParentGroup(domainId, channelId, groupId, token));

  await runRoleLifecycle(logger, {
    label: "channels",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Channels.listActions(domainId, token),
    createRole: (roleName) => sdk.Channels.createRole(channelId, roleName, domainId, token),
    listRoles: () => sdk.Channels.listRoles(channelId, domainId, page, token),
    getRole: (roleId) => sdk.Channels.getRole(channelId, domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Channels.updateRole(channelId, domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Channels.addRoleActions(channelId, domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Channels.listRoleActions(channelId, domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Channels.deleteRoleActions(channelId, domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Channels.deleteAllRoleActions(channelId, domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Channels.addRoleMembers(channelId, domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Channels.listRoleMembers(channelId, domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Channels.deleteRoleMembers(channelId, domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Channels.deleteAllRoleMembers(channelId, domainId, roleId, token),
    listMembers: () => sdk.Channels.listMembers(channelId, domainId, page, token),
    deleteRole: (roleId) => sdk.Channels.deleteRole(channelId, domainId, roleId, token),
  });

  if (config.destructive) {
    const bulkChannels = bulk && "channels" in bulk ? bulk.channels : [];
    for (const created of bulkChannels) {
      if (created.id) {
        await runStep(logger, `channels.delete.${created.id}`, () => sdk.Channels.delete(created.id as string, domainId, token));
      }
    }
  } else {
    logger.skipped("channels.delete", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
