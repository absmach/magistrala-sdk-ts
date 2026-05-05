// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type { Client, ClientsPage, MemberRolesPage, MembersPage } from "../src/sdk";

enableFetchMocks();

const clientsUrl = "http://localhost";
const usersUrl = "http://localhost";
const sdk = new SDK({ clientsUrl, usersUrl });

describe("Clients", () => {
  const client: Client = {
    id: "bb7edb32-2eac-4aad-aebe-ed96fe073879",
    name: "clientName",
    tags: ["tag1", "tag2"],
    credentials: {
      identity: "clientIdentity",
      secret: "bb7edb32-2eac-4aad-aebe-ed96fe073879",
    },
    metadata: {
      domain: "example.com",
    },
    status: "enabled",
  };
  const clients = [
    { name: "client1", id: "bb7edb32-2eac-4aad-aebe-ed96fe073879" },
    { name: "client2", id: "bb7edb32-2eac-4aad-aebe-ed96fe073879" },
  ];
  const queryParams = {
    offset: 0,
    limit: 10,
  };
  const clientsPage: ClientsPage = {
    clients: [client],
    total: 2,
    offset: 10,
    limit: 0,
  };
  const clientId = "bb7edb32-2eac-4aad-aebe-ed96fe073879";
  const groupId = "1be56995-aa42-4940-88e3-1fb1e82065fa";
  const domainId = "886b4266-77d1-4258-abae-2931fb4f16de";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjU3OTMwNjksImlhdCI6";
  const roleName = "editor";
  const roleId = "client_RYYW2unQ5K18jYgjRmb3lMFB";
  const actions = ["read", "write"];
  const members = ["user1", "user2"];
  const role = { name: roleName, actions, members };

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

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Create should create a client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.create(client, domainId, token);
    expect(response).toEqual(client);
  });

  test("Create clients should create multiple clients", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(clients));

    const response = await sdk.Clients.createBulk(clients, domainId, token);
    expect(response).toEqual(clients);
  });

  test("Disable should disable a client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.disable(clientId, domainId, token);
    expect(response).toEqual(client);
  });

  test("Enable should enable a client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.enable(clientId, domainId, token);
    expect(response).toEqual(client);
  });

  test("Update client secret should update a client's secret", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.updateSecret(
      client,
      domainId,
      token
    );
    expect(response).toEqual(client);
  });

  test("Update client tags should update a client's tags", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.updateTags(
      client,
      domainId,
      token
    );
    expect(response).toEqual(client);
  });

  test("Client should retrieve a client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.get(clientId, domainId, token);
    expect(response).toEqual(client);
  });

  test("Update client should update a client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(client));

    const response = await sdk.Clients.update(client, domainId, token);
    expect(response).toEqual(client);
  });

  test("Clients should get a list of all clients", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(clientsPage));

    const response = await sdk.Clients.list(queryParams, domainId, token);
    expect(response).toEqual(clientsPage);
  });
  test("Set client parent group should set a group parent to a Client", async () => {
    const ClientParentsResponse = {
      status: 200,
      message: "Client group parent added successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(ClientParentsResponse));

    const response = await sdk.Clients.setParentGroup(
      domainId,
      clientId,
      groupId,
      token
    );
    expect(response).toEqual(ClientParentsResponse);
  });

  test("Delete client parent group should delete a group parent from a Client", async () => {
    const ClientParentsResponse = {
      status: 200,
      message: "Client group parent deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(ClientParentsResponse));

    const response = await sdk.Clients.deleteParentGroup(
      domainId,
      clientId,
      token
    );
    expect(response).toEqual(ClientParentsResponse);
  });

  test("Delete client should delete a client", async () => {
    const deleteResponse = {
      status: 200,
      message: "Client deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteResponse));

    const response = await sdk.Clients.delete(clientId, domainId, token);
    expect(response).toEqual(deleteResponse);
  });

  test("List client actions should return available actions", async () => {
    const availableActions = ["read", "write", "delete"];
    fetchMock.mockResponseOnce(
      JSON.stringify({ available_actions: availableActions })
    );

    const response = await sdk.Clients.listActions(domainId, token);
    expect(response).toEqual(availableActions);
  });

  test("Create client role should create a new role and return it", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Clients.createRole(
      clientId,
      roleName,
      domainId,
      token,
      actions,
      members
    );
    expect(response).toEqual(role);
  });

  test("List client roles should return a page of roles", async () => {
    const rolesPage = { roles: [role], total: 1, offset: 0, limit: 10 };
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.Clients.listRoles(
      clientId,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(rolesPage);
  });

  test("View client role should return details of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Clients.getRole(
      clientId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(role);
  });

  test("Update client role should update a role and return the updated role", async () => {
    const updatedRole = { ...role, actions: [...role.actions, "execute"] };
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.Clients.updateRole(
      clientId,
      domainId,
      roleId,
      updatedRole,
      token
    );
    expect(response).toEqual(updatedRole);
  });

  test("Delete client role should delete a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Clients.deleteRole(
      clientId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add client role actions should add actions to a role and return updated actions", async () => {
    const updatedActions = [...actions, "execute"];
    fetchMock.mockResponseOnce(JSON.stringify({ actions: updatedActions }));

    const response = await sdk.Clients.addRoleActions(
      clientId,
      domainId,
      roleId,
      ["execute"],
      token
    );
    expect(response).toEqual(updatedActions);
  });

  test("List client role actions should return actions of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Clients.listRoleActions(
      clientId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(actions);
  });

  test("Delete client role actions should remove actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Clients.deleteRoleActions(
      clientId,
      domainId,
      roleId,
      ["write"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all client role actions should remove all actions from a role", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Clients.deleteAllRoleActions(
      clientId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Add client role members should add members to a role and return updated members", async () => {
    const updatedMembers = [...members, "user3"];
    fetchMock.mockResponseOnce(JSON.stringify({ members: updatedMembers }));

    const response = await sdk.Clients.addRoleMembers(
      clientId,
      domainId,
      roleId,
      ["user3"],
      token
    );
    expect(response).toEqual(updatedMembers);
  });

  test("List client role members should return members of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.Clients.listRoleMembers(
      clientId,
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersPage);
  });

  test("Delete client role members should remove members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Clients.deleteRoleMembers(
      clientId,
      domainId,
      roleId,
      ["user1"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("Delete all client role members should remove all members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Clients.deleteAllRoleMembers(
      clientId,
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("List client members should return members of a specific client", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.Clients.listMembers(
      clientId,
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersRolePage);
  });
});
