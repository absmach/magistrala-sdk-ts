// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import {
  type Schedule,
} from "../../src/sdk";
import { createScenarioContext, finishScenario } from "./context";
import {
  createAlarmRule,
  createSaveSenmlRule,
  ensureMessaging,
  page,
  prefixFor,
  requireChannel,
  requireDomain,
  requireDomainId,
  requireId,
  requireToken,
  runRoleLifecycle,
  tryStep,
} from "./helpers";

const nextSchedule = (): Schedule => ({
  start_datetime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  time: "1970-01-01T10:00:00.000Z",
  recurring: "daily",
  recurring_period: 1,
});

const main = async (): Promise<void> => {
  const context = createScenarioContext("Rules Engine scenario");
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
  const channel = requireChannel(domain);
  const saveRule = await createSaveSenmlRule(context, domain, channel);
  const alarmRule = await createAlarmRule(context, domain, channel);
  const ruleId = requireId(saveRule, "rule");
  const userId = state.user?.data.id;

  await tryStep(logger, "rules.list", () => sdk.Rules.list(domainId, page, token));
  await tryStep(logger, "rules.view", () => sdk.Rules.view(domainId, ruleId, token, true));
  await tryStep(logger, "rules.update", () => sdk.Rules.update(
    domainId,
    {
      id: ruleId,
      name: `${prefixFor(config, state)}-save-senml-updated`,
      logic: saveRule.logic,
      outputs: saveRule.outputs,
      input_channel: saveRule.input_channel,
      input_topic: saveRule.input_topic,
    },
    token
  ));
  await tryStep(logger, "rules.updateTags", () => sdk.Rules.updateTags(domainId, ruleId, ["setup", "save_senml"], token));
  await tryStep(logger, "rules.updateSchedule", () => sdk.Rules.updateSchedule(domainId, ruleId, nextSchedule(), token));
  await tryStep(logger, "rules.disable", () => sdk.Rules.disable(domainId, ruleId, token));
  await tryStep(logger, "rules.enable", () => sdk.Rules.enable(domainId, ruleId, token));
  await tryStep(logger, "rules.viewAlarmRule", () => sdk.Rules.view(domainId, requireId(alarmRule, "alarm rule"), token, true));

  await runRoleLifecycle(logger, {
    label: "rules",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Rules.listActions(domainId, token),
    createRole: (roleName) => sdk.Rules.createRole(ruleId, roleName, domainId, token),
    listRoles: () => sdk.Rules.listRoles(ruleId, domainId, page, token),
    getRole: (roleId) => sdk.Rules.getRole(ruleId, domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Rules.updateRole(ruleId, domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Rules.addRoleActions(ruleId, domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Rules.listRoleActions(ruleId, domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Rules.deleteRoleActions(ruleId, domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Rules.deleteAllRoleActions(ruleId, domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Rules.addRoleMembers(ruleId, domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Rules.listRoleMembers(ruleId, domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Rules.deleteRoleMembers(ruleId, domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Rules.deleteAllRoleMembers(ruleId, domainId, roleId, token),
    listMembers: () => sdk.Rules.listMembers(ruleId, domainId, page, token),
    deleteRole: (roleId) => sdk.Rules.deleteRole(ruleId, domainId, roleId, token),
  });

  if (config.destructive) {
    await tryStep(logger, "rules.delete", () => sdk.Rules.delete(domainId, ruleId, token));
  } else {
    logger.skipped("rules.delete", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
