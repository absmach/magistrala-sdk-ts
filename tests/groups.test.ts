// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type {
  Group,
  GroupsPage,
  HierarchyPage,
  MemberRolesPage,
  MembersPage,
  Role,
  RolePage,
} from "../src/sdk";

enableFetchMocks();

const groupsUrl = "http://localhost";
const sdk = new SDK({ groupsUrl });

describe("Groups", () => {
  const group: Group = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    domain_id: "886b4266-77d1-4258-abae-2931fb4f16de",
    parent_id: "886b4266-77d1-4258-abae-2931fb4f16de",
    name: "fkatwigs",
    description: "holy terrain",
    level: 1,
    path: "holy terrain",
    status: "enabled",
  };

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";

  const groupId = "886b4266-77d1-4258-abae-2931fb4f16de";

  const parentId = "886b4266-77d1-4258-abae-2931fb4f16de";

  const actions = ["create", "update", "delete", "view"];
  const members = [
    "886b4266-77d1-4258-abae-2931fb4f16ie",
    "886b4266-77d1-4258-abae-2931fb4f16ye",
  ];

  const role: Role = {
    name: "editor",
    entity_id: groupId,
  };

  const rolesPage: RolePage = {
    roles: [role],
    offset: 0,
    limit: 10,
    total: 1,
  };

  const roleId = "group_RYYW2unQ5K18jYgjRmb3lMFB";

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
    total: 3,
    offset: 0,
    limit: 10,
    members: [
      {
        member_id: "59c83204-192b-4c1c-ba1a-5a7c80b71dff",
        roles: [
          {
            role_name: "editor",
            actions: ["read", "write"],
          },
        ],
      },
      {
        member_id: "c096bb08-e993-46a8-8baa-ac3d61b9212a",
        roles: [
          {
            role_name: "editor",
            actions: ["read", "write"],
          },
        ],
      },
    ],
  };

  const groupsPage: GroupsPage = {
    groups: [group],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const hierarchyPage: HierarchyPage = {
    level: 0,
    direction: 1,
    groups: [group],
  };

  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const domainId = "886b4266-77d1-4258-abae-2931fb4f16de";

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Create group should create a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(group));

    const response = await sdk.Groups.create(group, domainId, token);
    expect(response).toEqual(group);
  });

  test("Group should get a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(group));

    const response = await sdk.Groups.get(groupId, domainId, token);
    expect(response).toEqual(group);
  });

  test("Groups should get all groups", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(groupsPage));

    const response = await sdk.Groups.list(queryParams, domainId, token);
    expect(response).toEqual(groupsPage);
  });

  test("Update group should update a groups name and metadata", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(group));

    const response = await sdk.Groups.update(group, domainId, token);
    expect(response).toEqual(group);
  });

  test("Enable group should enable a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(group));

    const response = await sdk.Groups.enable(groupId, domainId, token);
    expect(response).toEqual(group);
  });

  test("Disable group should disable a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(group));

    const response = await sdk.Groups.disable(groupId, domainId, token);
    expect(response).toEqual(group);
  });

  test("Delete group should delete a group", async () => {
    const deleteGroupResponse = {
      status: 200,
      message: "Group deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteGroupResponse));

    const response = await sdk.Groups.delete(groupId, domainId, token);
    expect(response).toEqual(deleteGroupResponse);
  });

  test("List children groups should get all of a groups children", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(groupsPage));

    const response = await sdk.Groups.listChildren(
      groupId,
      domainId,
      queryParams,
      token
    );
    expect(response).toEqual(groupsPage);
  });

  test("Retrieve group hierarchy should get the hierarchical structure of a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(hierarchyPage));

    const response = await sdk.Groups.getHierarchy(
      groupId,
      domainId,
      { level: 0, direction: 1 },
      token
    );

    expect(response).toEqual(hierarchyPage);
  });

  test("Add parent group adds a parent group to the specified group", async () => {
    const addParentResponse = {
      status: 200,
      message: "Parent added successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(addParentResponse));

    const response = await sdk.Groups.addParent(
      groupId,
      domainId,
      parentId,
      token
    );
    expect(response).toEqual(addParentResponse);
  });

  test("Remove parent group removes a parent group to the specified group", async () => {
    const removeParentResponse = {
      status: 200,
      message: "Parent removed successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(removeParentResponse));

    const response = await sdk.Groups.removeParent(
      groupId,
      domainId,
      token
    );
    expect(response).toEqual(removeParentResponse);
  });

  test("Add children groups adds children groups to a specified group", async () => {
    const removeParentResponse = {
      status: 200,
      message: "Children added successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(removeParentResponse));

    const response = await sdk.Groups.addChildren(
      groupId,
      domainId,
      [
        "886b4266-77d1-4258-abae-2931fb4f16de",
        "886b4266-77d1-4258-abae-2931fb4f1sde",
      ],
      token
    );
    expect(response).toEqual(removeParentResponse);
  });

  test("Remove children groups removes children groups to a specified group", async () => {
    const removeParentResponse = {
      status: 200,
      message: "Children removed successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(removeParentResponse));

    const response = await sdk.Groups.removeChildren(
      groupId,
      domainId,
      [
        "886b4266-77d1-4258-abae-2931fb4f16de",
        "886b4266-77d1-4258-abae-2931fb4f1sde",
      ],
      token
    );
    expect(response).toEqual(removeParentResponse);
  });

  test("Remove all children groups removes all children groups to a specified group", async () => {
    const removeParentResponse = {
      status: 200,
      message: "All children removed successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(removeParentResponse));

    const response = await sdk.Groups.removeAllChildren(
      groupId,
      domainId,
      token
    );
    expect(response).toEqual(removeParentResponse);
  });

  test("List children groups should get all children of a group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(groupsPage));

    const response = await sdk.Groups.listChildren(
      groupId,
      domainId,
      { offset: 0, limit: 10 },
      token
    );

    expect(response).toEqual(groupsPage);
  });

  test("List group actions should return all available actions for a domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ available_actions: actions }));
    const response = await sdk.Groups.listActions(domainId, token);

    expect(response).toEqual(actions);
  });

  test("Create group role should create a new role with optional actions and members", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Groups.createRole(
      groupId,
      domainId,
      "editor",
      token
    );

    expect(response).toEqual(role);
  });

  test("List group roles should return a paginated list of roles", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.Groups.listRoles(
      groupId,
      domainId,
      { offset: 0, limit: 10 },
      token
    );

    expect(response).toEqual(rolesPage);
  });

  test("View group role should return role details", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Groups.getRole(
      groupId,
      domainId,
      roleId,
      token
    );

    expect(response).toEqual(role);
  });

  test("Update group role should return the updated role", async () => {
    const updatedRole: Role = role;
    updatedRole.name = "group_editor";
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.Groups.updateRole(
      groupId,
      domainId,
      roleId,
      updatedRole,
      token
    );

    expect(response).toEqual(role);
  });

  test("Delete group role should return deletion response", async () => {
    const removeParentResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(removeParentResponse));

    const response = await sdk.Groups.deleteRole(
      groupId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(removeParentResponse);
  });

  test("Add group role actions should return updated actions", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Groups.addRoleActions(
      groupId,
      domainId,
      roleId,
      actions,
      token
    );

    expect(response).toEqual(actions);
  });

  test("List group role actions should return a list of actions", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Groups.listRoleActions(
      groupId,
      domainId,
      roleId,
      token
    );

    expect(response).toEqual(actions);
  });

  test("Delete group role actions should return deletion response", async () => {
    const deleteRoleActionResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteRoleActionResponse));

    const response = await sdk.Groups.deleteRoleActions(
      groupId,
      domainId,
      roleId,
      actions,
      token
    );

    expect(response).toEqual(deleteRoleActionResponse);
  });

  test("Delete all group role actions should return deletion response", async () => {
    const deleteRoleActionResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteRoleActionResponse));

    const response = await sdk.Groups.deleteAllRoleActions(
      groupId,
      domainId,
      roleId,
      token
    );

    expect(response).toEqual(deleteRoleActionResponse);
  });
  test("Add group role members should return created members", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ members }));

    const response = await sdk.Groups.addRoleMembers(
      groupId,
      domainId,
      roleId,
      members,
      token
    );

    expect(response).toEqual(members);
  });

  test("List group role members should return members", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.Groups.listRoleMembers(
      groupId,
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );

    expect(response).toEqual(membersPage);
  });

  test("Delete group role members should return deletion response", async () => {
    const deleteMembersResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteMembersResponse));

    const remMembers = ["886b4266-77d1-4258-abae-2931fb4f16ie"];

    const response = await sdk.Groups.deleteRoleMembers(
      groupId,
      domainId,
      roleId,
      remMembers,
      token
    );

    expect(response).toEqual(deleteMembersResponse);
  });

  test("Delete all group role members should return deletion response", async () => {
    const deleteMembersResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteMembersResponse));

    const response = await sdk.Groups.deleteAllRoleMembers(
      groupId,
      domainId,
      roleId,
      token
    );

    expect(response).toEqual(deleteMembersResponse);
  });

  test("List group members should return members of a specific group", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.Groups.listMembers(
      groupId,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersRolePage);
  });
});
