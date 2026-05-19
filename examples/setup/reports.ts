// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import {
  type Schedule,
} from "../../src/sdk";
import { createScenarioContext, finishScenario } from "./context";
import {
  createPat,
  createReportConfig,
  ensureMessaging,
  page,
  prefixFor,
  requireChannel,
  requireClient,
  requireDomain,
  requireDomainId,
  requireId,
  requireToken,
  runRoleLifecycle,
  runStep,
  tryStep,
} from "./helpers";

const nextSchedule = (): Schedule => ({
  start_datetime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  time: "1970-01-01T10:00:00.000Z",
  recurring: "daily",
  recurring_period: 1,
});

const main = async (): Promise<void> => {
  const context = createScenarioContext("Reports scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureMessaging(context, 1);
  await createPat(context, 0);
  await createPat(context, 1);

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const channel = requireChannel(domain);
  const reportConfig = await createReportConfig(context, domain, client, channel, 0);
  const configId = requireId(reportConfig, "report config");
  const userId = state.user?.data.id;

  const generated = await runStep(logger, "reports.generate", () => sdk.Reports.generate(domainId, reportConfig, token));
  domain.reports.push(generated);
  await tryStep(logger, "reports.getConfig", () => sdk.Reports.getConfig(domainId, configId, token, true));
  await tryStep(logger, "reports.listConfigs", () => sdk.Reports.listConfigs(domainId, page, token));
  await tryStep(logger, "reports.updateConfig", () => sdk.Reports.updateConfig(
    domainId,
    {
      ...reportConfig,
      id: configId,
      name: `${prefixFor(config, state)}-report-updated`,
    },
    token
  ));
  await tryStep(logger, "reports.updateSchedule", () => sdk.Reports.updateSchedule(domainId, configId, nextSchedule(), token));
  await tryStep(logger, "reports.disableConfig", () => sdk.Reports.disableConfig(domainId, configId, token));
  await tryStep(logger, "reports.enableConfig", () => sdk.Reports.enableConfig(domainId, configId, token));
  await tryStep(logger, "reports.updateTemplate", () => sdk.Reports.updateTemplate(
    domainId,
    configId,
    "<html><body><h1>{{ title }}</h1></body></html>",
    token
  ));
  await tryStep(logger, "reports.getTemplate", () => sdk.Reports.getTemplate(domainId, configId, token));
  await tryStep(logger, "reports.listActions", () => sdk.Reports.listActions(domainId, token));

  await runRoleLifecycle(logger, {
    label: "reports",
    destructive: config.destructive,
    memberId: userId,
    listActions: () => sdk.Reports.listActions(domainId, token),
    createRole: (roleName) => sdk.Reports.createRole(configId, roleName, domainId, token),
    listRoles: () => sdk.Reports.listRoles(configId, domainId, page, token),
    getRole: (roleId) => sdk.Reports.getRole(configId, domainId, roleId, token),
    updateRole: (roleId, role) => sdk.Reports.updateRole(configId, domainId, roleId, role, token),
    addRoleActions: (roleId, actions) => sdk.Reports.addRoleActions(configId, domainId, roleId, actions, token),
    listRoleActions: (roleId) => sdk.Reports.listRoleActions(configId, domainId, roleId, token),
    deleteRoleActions: (roleId, actions) => sdk.Reports.deleteRoleActions(configId, domainId, roleId, actions, token),
    deleteAllRoleActions: (roleId) => sdk.Reports.deleteAllRoleActions(configId, domainId, roleId, token),
    addRoleMembers: (roleId, members) => sdk.Reports.addRoleMembers(configId, domainId, roleId, members, token),
    listRoleMembers: (roleId) => sdk.Reports.listRoleMembers(configId, domainId, roleId, page, token),
    deleteRoleMembers: (roleId, members) => sdk.Reports.deleteRoleMembers(configId, domainId, roleId, members, token),
    deleteAllRoleMembers: (roleId) => sdk.Reports.deleteAllRoleMembers(configId, domainId, roleId, token),
    listMembers: () => sdk.Reports.listMembers(configId, domainId, page, token),
    deleteRole: (roleId) => sdk.Reports.deleteRole(configId, domainId, roleId, token),
  });

  if (config.destructive) {
    await tryStep(logger, "reports.deleteTemplate", () => sdk.Reports.deleteTemplate(domainId, configId, token));
    await tryStep(logger, "reports.deleteConfig", () => sdk.Reports.deleteConfig(domainId, configId, token));
  } else {
    logger.skipped("reports.deleteTemplate", "set MG_RUN_DESTRUCTIVE=true");
    logger.skipped("reports.deleteConfig", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
