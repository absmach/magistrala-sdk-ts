// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import SDK, {
  Report,
  ReportConfig,
  ReportConfigPage,
  ReportPage,
  SenMLMessage,
  RolePage,
  MemberRolesPage,
  MembersPage,
} from "../src/sdk";
import { ReqMetric, Schedule, Template } from "../src/defs";

enableFetchMocks();

const reportsUrl = "http://localhost";
const sdk = new SDK({ reportsUrl });

describe("Reports SDK", () => {
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const domainId = "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1";
  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const metric: ReqMetric = {
    channel_id: "channel",
    client_ids: ["client"],
    name: "temp",
    subtopic: "",
    protocol: "",
    format: "",
  };

  const schedule: Schedule = {
    start_datetime: "2025-04-24T12:00:00.000Z",
    time: "1970-01-01T10:00:00.000Z",
    recurring: "weekly",
    recurring_period: 1,
  };

  const reportConfig: ReportConfig = {
    id: "id",
    name: "name",
    description: "description",
    domain_id: domainId,
    metrics: [metric],
    schedule,
  };

  const reportConfigPage: ReportConfigPage = {
    report_configs: [reportConfig],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const message: SenMLMessage = {
    channel: "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
    publisher: "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
    protocol: "http",
    name: "voltage",
    unit: "V",
    time: 1276020076.001,
    value: 120.1,
  };

  const report: Report = {
    metric,
    messages: [message],
  };

  const reportsPage: ReportPage = {
    reports: [report],
    total: 1,
  };

  const htmlTemplate: string = "";

  const template: Template = {
    html_template: htmlTemplate,
  };

  const roleId = "report_RYYW2unQ5K18jYgjRmb3lMFB";
  const roleName = "editor";
  const actions = ["read", "write"];
  const members = ["user1", "user2"];
  const role = { name: roleName, actions, members };
  const rolesPage: RolePage = {
    roles: [role],
    total: 1,
    offset: 0,
    limit: 10,
  };
  const membersPage: MembersPage = {
    total: 2,
    offset: 0,
    limit: 10,
    members: [
      "59c83204-192b-4c1c-ba1a-5a7c80b71dff",
      "af3aad36-58df-478a-9b89-f5057b40ca55",
    ],
  };
  const membersRolePage: MemberRolesPage = {
    total: 1,
    offset: 0,
    limit: 10,
    members: [
      {
        member_id: "59c83204-192b-4c1c-ba1a-5a7c80b71dff",
        roles: [{ role_name: "editor", actions: ["read", "write"] }],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Generate report should generate a reports page", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(reportsPage));

    const response = await sdk.Reports.generateReport(
      domainId,
      reportConfig,
      token
    );
    expect(response).toEqual(reportsPage);
  });

  test("Add report config should add a new report configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(reportConfig));

    const response = await sdk.Reports.addReportConfig(
      domainId,
      reportConfig,
      token
    );
    expect(response).toEqual(reportConfig);
  });

  test("View report config should return a report configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(reportConfig));

    const response = await sdk.Reports.viewReportConfig(
      domainId,
      reportConfig.id as string,
      token
    );

    expect(response).toEqual(reportConfig);
  });

  test("List report configs should return a list of report configurations", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(reportConfigPage));
    const response = await sdk.Reports.listReportConfigs(
      domainId,
      queryParams,
      token
    );
    expect(response).toEqual(reportConfigPage);
  });

  test("Update report config should update an existing report configuration", async () => {
    const updatedConfig: ReportConfig = {
      ...reportConfig,
      name: "updated name",
    };

    fetchMock.mockResponseOnce(JSON.stringify(updatedConfig));

    const response = await sdk.Reports.updateReportConfig(
      domainId,
      updatedConfig,
      token
    );

    expect(response).toEqual(updatedConfig);
  });

  test("Update report schedule should update an existing report schedule", async () => {
    const updatedSchedule: Schedule = {
      ...schedule,
      recurring_period: 2,
    };
    reportConfig.schedule = updatedSchedule;

    fetchMock.mockResponseOnce(JSON.stringify(reportConfig));

    const response = await sdk.Reports.updateReportSchedule(
      domainId,
      reportConfig.id as string,
      updatedSchedule,
      token
    );

    expect(response).toEqual(reportConfig);
  });

  test("Delete report config should delete an existing report configuration", async () => {
    const successResponse = {
      status: 200,
      message: "Report config deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteReportConfig(
      domainId,
      reportConfig.id as string,
      token
    );

    expect(response).toEqual(successResponse);
  });

  test("Enable report config should enable a report configuration", async () => {
    reportConfig.status = "enabled";
    fetchMock.mockResponseOnce(JSON.stringify(reportConfig));

    const response = await sdk.Reports.enableReportConfig(
      domainId,
      reportConfig.id as string,
      token
    );
    expect(response).toEqual(reportConfig);
  });

  test("Disable report config should disable a report configuration", async () => {
    reportConfig.status = "disabled";
    fetchMock.mockResponseOnce(JSON.stringify(reportConfig));

    const response = await sdk.Reports.disableReportConfig(
      domainId,
      reportConfig.id as string,
      token
    );
    expect(response).toEqual(reportConfig);
  });

  test("Update report template should update a report template", async () => {
    const response = await sdk.Reports.updateReportTemplate(
      domainId,
      reportConfig.id as string,
      htmlTemplate,
      token
    );
    expect(response).toBeUndefined();
  });

  test("View report template should return a report template", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(template));

    const response = await sdk.Reports.viewReportTemplate(
      domainId,
      reportConfig.id as string,
      token
    );
    expect(response).toEqual(template);
  });

  test("Delete report template should delete a report template", async () => {
    const response = await sdk.Reports.deleteReportTemplate(
      domainId,
      reportConfig.id as string,
      token
    );
    expect(response).toBeUndefined();
  });

  test("List report config actions should return available actions", async () => {
    const availableActions = ["read", "write", "delete"];
    fetchMock.mockResponseOnce(
      JSON.stringify({ available_actions: availableActions })
    );

    const response = await sdk.Reports.listReportConfigActions(domainId, token);
    expect(response).toEqual(availableActions);
  });

  test("Create report config role should create a new role and return it", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Reports.createReportConfigRole(
      reportConfig.id as string,
      roleName,
      domainId,
      token,
      actions,
      members
    );
    expect(response).toEqual(role);
  });

  test("List report config roles should return a page of roles", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.Reports.listReportConfigRoles(
      reportConfig.id as string,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(rolesPage);
  });

  test("View report config role should return details of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Reports.viewReportConfigRole(
      reportConfig.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(role);
  });

  test("Update report config role should update a role and return the updated role", async () => {
    const updatedRole = { ...role, actions: [...role.actions, "execute"] };
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.Reports.updateReportConfigRole(
      reportConfig.id as string,
      domainId,
      roleId,
      updatedRole,
      token
    );
    expect(response).toEqual(updatedRole);
  });

  test("Delete report config role should delete a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteReportConfigRole(
      reportConfig.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add report config role actions should add actions to a role and return updated actions", async () => {
    const updatedActions = [...actions, "execute"];
    fetchMock.mockResponseOnce(JSON.stringify({ actions: updatedActions }));

    const response = await sdk.Reports.addReportConfigRoleActions(
      reportConfig.id as string,
      domainId,
      roleId,
      ["execute"],
      token
    );
    expect(response).toEqual(updatedActions);
  });

  test("List report config role actions should return actions of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Reports.listReportConfigRoleActions(
      reportConfig.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(actions);
  });

  test("Delete report config role actions should remove actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteReportConfigRoleActions(
      reportConfig.id as string,
      domainId,
      roleId,
      ["write"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all report config role actions should remove all actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteAllReportConfigRoleActions(
      reportConfig.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add report config role members should add members to a role and return updated members", async () => {
    const updatedMembers = [...members, "user3"];
    fetchMock.mockResponseOnce(JSON.stringify({ members: updatedMembers }));

    const response = await sdk.Reports.addReportConfigRoleMembers(
      reportConfig.id as string,
      domainId,
      roleId,
      ["user3"],
      token
    );
    expect(response).toEqual(updatedMembers);
  });

  test("List report config role members should return members of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.Reports.listReportConfigRoleMembers(
      reportConfig.id as string,
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersPage);
  });

  test("Delete report config role members should remove members from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteReportConfigRoleMembers(
      reportConfig.id as string,
      domainId,
      roleId,
      ["user1"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all report config role members should remove all members from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Reports.deleteAllReportConfigRoleMembers(
      reportConfig.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("List report config members should return members of a specific report config", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.Reports.listReportConfigMembers(
      reportConfig.id as string,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersRolePage);
  });
});
