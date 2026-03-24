// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK, {
  Rule,
  RulesPage,
  Schedule,
  RolePage,
  MemberRolesPage,
  MembersPage,
} from "../src/sdk";

enableFetchMocks();

const rulesUrl = "http://localhost";
const sdk = new SDK({ rulesUrl });

describe("Rules SDK", () => {
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const domainId = "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1";
  const queryParams = {
    offset: 0,
    limit: 10,
  };
  const roleId = "rule_RYYW2unQ5K18jYgjRmb3lMFB";
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
  const rule: Rule = {
    id: "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1",
    name: "rule 1",
    schedule: {
      start_datetime: "2025-02-07T03:14:00.000Z",
      time: "0001-01-01T07:39:44.000Z",
      recurring: "none",
      recurring_period: 0,
    },
    logic: {
      type: 0,
      value: "this is the logic",
    },
    metadata: {
      key: "value",
    },
    tags: ["tag1", "tag2"],
  };

  const rulesPage: RulesPage = {
    rules: [rule],
    total: 1,
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Create should create a rule", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.create(domainId, rule, token);
    expect(response).toEqual(rule);
  });

  test("List should return a list of rules", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rulesPage));

    const response = await sdk.Rules.list(domainId, queryParams, token);
    expect(response).toEqual(rulesPage);
  });

  test("View should return a rule", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.view(domainId, rule.id as string, token);
    expect(response).toEqual(rule);
  });

  test("Update should update a rule", async () => {
    const updatedRule: Rule = {
      ...rule,
      name: "updated rule",
    };

    fetchMock.mockResponseOnce(JSON.stringify(updatedRule));

    const response = await sdk.Rules.update(domainId, updatedRule, token);
    expect(response).toEqual(updatedRule);
  });

  test("Update tags should update the rule tags", async () => {
    const updatedTags = ["tag3", "tag4"];
    rule.tags = updatedTags;
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.updateTags(
      domainId,
      rule.id as string,
      updatedTags,
      token
    );

    expect(response).toEqual(rule);
  });

  test("Update schedule should update the schedule", async () => {
    const updatedSchedule: Schedule = {
      start_datetime: "2025-02-07T03:14:00.000Z",
      time: "0001-01-01T07:39:44.000Z",
      recurring: "none",
      recurring_period: 0,
    };
    rule.schedule = updatedSchedule;
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.updateSchedule(
      domainId,
      rule.id as string,
      updatedSchedule,
      token
    );
    expect(response).toEqual(rule);
  });

  test("Delete should delete a rule", async () => {
    const successResponse = {
      status: 200,
      message: "Rule deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.delete(domainId, rule.id as string, token);
    expect(response).toEqual(successResponse);
  });

  test("Enable should enable a rule", async () => {
    rule.status = "enabled";
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.enable(domainId, rule.id as string, token);
    expect(response).toEqual(rule);
  });

  test("Disable should disable a rule", async () => {
    rule.status = "disabled";
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.disable(
      domainId,
      rule.id as string,
      token
    );
    expect(response).toEqual(rule);
  });

  test("List rule actions should return available actions", async () => {
    const availableActions = ["read", "write", "delete"];
    fetchMock.mockResponseOnce(
      JSON.stringify({ available_actions: availableActions })
    );

    const response = await sdk.Rules.listRuleActions(domainId, token);
    expect(response).toEqual(availableActions);
  });

  test("Create rule role should create a new role and return it", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Rules.createRuleRole(
      rule.id as string,
      roleName,
      domainId,
      token,
      actions,
      members
    );
    expect(response).toEqual(role);
  });

  test("List rule roles should return a page of roles", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.Rules.listRuleRoles(
      rule.id as string,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(rolesPage);
  });

  test("View rule role should return details of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Rules.viewRuleRole(
      rule.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(role);
  });

  test("Update rule role should update a role and return the updated role", async () => {
    const updatedRole = { ...role, actions: [...role.actions, "execute"] };
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.Rules.updateRuleRole(
      rule.id as string,
      domainId,
      roleId,
      updatedRole,
      token
    );
    expect(response).toEqual(updatedRole);
  });

  test("Delete rule role should delete a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.deleteRuleRole(
      rule.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add rule role actions should add actions to a role and return updated actions", async () => {
    const updatedActions = [...actions, "execute"];
    fetchMock.mockResponseOnce(JSON.stringify({ actions: updatedActions }));

    const response = await sdk.Rules.addRuleRoleActions(
      rule.id as string,
      domainId,
      roleId,
      ["execute"],
      token
    );
    expect(response).toEqual(updatedActions);
  });

  test("List rule role actions should return actions of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Rules.listRuleRoleActions(
      rule.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(actions);
  });

  test("Delete rule role actions should remove actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.deleteRuleRoleActions(
      rule.id as string,
      domainId,
      roleId,
      ["write"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all rule role actions should remove all actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.deleteAllRuleRoleActions(
      rule.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add rule role members should add members to a role and return updated members", async () => {
    const updatedMembers = [...members, "user3"];
    fetchMock.mockResponseOnce(JSON.stringify({ members: updatedMembers }));

    const response = await sdk.Rules.addRuleRoleMembers(
      rule.id as string,
      domainId,
      roleId,
      ["user3"],
      token
    );
    expect(response).toEqual(updatedMembers);
  });

  test("List rule role members should return members of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.Rules.listRuleRoleMembers(
      rule.id as string,
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersPage);
  });

  test("Delete rule role members should remove members from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.deleteRuleRoleMembers(
      rule.id as string,
      domainId,
      roleId,
      ["user1"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all rule role members should remove all members from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.deleteAllRuleRoleMembers(
      rule.id as string,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("List rule members should return members of a specific rule", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.Rules.listRuleMembers(
      rule.id as string,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersRolePage);
  });
});
