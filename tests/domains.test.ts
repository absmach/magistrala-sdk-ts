// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type {
  Domain,
  DomainsPage,
  MemberRolesPage,
  MembersPage,
  Invitation,
  InvitationsPage
} from "../src/sdk";

enableFetchMocks();

const domainsUrl = "http://localhost";
const sdk = new SDK({ domainsUrl });

describe("Domains", () => {
  const domain: Domain = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    name: "fkatwigs",
    route: "music",
    status: "enabled",
  };

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";

  const domainId = "886b4266-77d1-4258-abae-2931fb4f16de";

  const userId = "886b4266-77d1-4258-abae-2931fb4f16de";

  const roleName = "editor";
  const roleId = "domain_RYYW2unQ5K18jYgjRmb3lMFB";
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
  const domainsPage: DomainsPage = {
    domains: [domain],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const invitation: Invitation = {
    invited_by: "6a422a33-f849-4631-aa8f-92132037c84a",
    invitee_user_id: "99419100-b577-4d1a-a4d0-4383be3f4aef",
    domain_id: "3ca9a205-fc34-4c64-b21a-cd48a8c6d380",
    role_id: "domain_h7QSXUqR6a7he9eRE3HmDcbt",
  };

  const invitationsPage: InvitationsPage = {
    invitations: [invitation],
    total: 1,
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Create should create a domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domain));

    const response = await sdk.Domains.create(domain, token);
    expect(response).toEqual(domain);
  });

  test("Domains should return a list of domains", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domainsPage));

    const response = await sdk.Domains.list(queryParams, token);
    expect(response).toEqual(domainsPage);
  });

  test("Domain should return a domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domain));

    const response = await sdk.Domains.get(domainId, token);
    expect(response).toEqual(domain);
  });

  test("Update should update a domain name and metadata", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domain));

    const response = await sdk.Domains.update(domain, token);
    expect(response).toEqual(domain);
  });

  test("List user domains should return a list of user domains", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domainsPage));

    const response = await sdk.Domains.listByUser(
      userId,
      queryParams,
      token
    );
    expect(response).toEqual(domainsPage);
  });

  test("Enable domain should enable a domain", async () => {
    const enableDomainResponse = {
      status: 200,
      message: "Domain enabled successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(enableDomainResponse));

    const response = await sdk.Domains.enable(domainId, token);
    expect(response).toEqual(enableDomainResponse);
  });

  test("Disable domain should disable a domain", async () => {
    const disableDomainResponse = {
      status: 200,
      message: "Domain disabled successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(disableDomainResponse));

    const response = await sdk.Domains.disable(domainId, token);
    expect(response).toEqual(disableDomainResponse);
  });

  test("Freeze domain should freeze a domain", async () => {
    const freezeDomainResponse = {
      status: 200,
      message: "Domain frozen successfully",
    };

    fetchMock.mockResponseOnce(JSON.stringify(freezeDomainResponse));

    const response = await sdk.Domains.freeze(domainId, token);
    expect(response).toEqual(freezeDomainResponse);
  });

  test("listActions should return available actions", async () => {
    const availableActions = ["read", "write", "delete"];
    fetchMock.mockResponseOnce(
      JSON.stringify({ available_actions: availableActions })
    );

    const response = await sdk.Domains.listActions(token);
    expect(response).toEqual(availableActions);
  });

  test("createRole should create a new role and return it", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Domains.createRole(
      domainId,
      roleName,
      token,
      actions,
      members
    );
    expect(response).toEqual(role);
  });

  test("listRoles should return a page of roles", async () => {
    const rolesPage = { roles: [role], total: 1, offset: 0, limit: 10 };
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.Domains.listRoles(
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(rolesPage);
  });

  test("getRole should return details of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.Domains.getRole(domainId, roleId, token);
    expect(response).toEqual(role);
  });

  test("updateRole should update a role and return the updated role", async () => {
    const updatedRole = { ...role, actions: [...role.actions, "execute"] };
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.Domains.updateRole(
      domainId,
      roleId,
      updatedRole,
      token
    );
    expect(response).toEqual(updatedRole);
  });

  test("deleteRole should delete a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Domains.deleteRole(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("addRoleActions should add actions to a role and return updated actions", async () => {
    const updatedActions = [...actions, "execute"];
    fetchMock.mockResponseOnce(JSON.stringify({ actions: updatedActions }));

    const response = await sdk.Domains.addRoleActions(
      domainId,
      roleId,
      ["execute"],
      token
    );
    expect(response).toEqual(updatedActions);
  });

  test("listRoleActions should return actions of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.Domains.listRoleActions(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(actions);
  });

  test("deleteRoleActions should remove actions from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Domains.deleteRoleActions(
      domainId,
      roleId,
      ["write"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("deleteAllRoleActions should remove all actions from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Domains.deleteAllRoleActions(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("addRoleMembers should add members to a role and return updated members", async () => {
    const updatedMembers = [...members, "user3"];
    fetchMock.mockResponseOnce(JSON.stringify({ members: updatedMembers }));

    const response = await sdk.Domains.addRoleMembers(
      domainId,
      roleId,
      ["user3"],
      token
    );
    expect(response).toEqual(updatedMembers);
  });

  test("listRoleMembers should return members of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.Domains.listRoleMembers(
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersPage);
  });

  test("deleteRoleMembers should remove members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Domains.deleteRoleMembers(
      domainId,
      roleId,
      ["user1"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("deleteAllRoleMembers should remove all members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Domains.deleteAllRoleMembers(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("List domain members should return members of a specific domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.Domains.listMembers(
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersRolePage);
  });

  test("Send invitation should send an invitation", async () => {
    const SendInvitationResponse = {
      status: 200,
      message: "Invitation sent successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(SendInvitationResponse));

    const response = await sdk.Domains.sendInvitation(userId, domainId, roleId, token);
    expect(response).toEqual(SendInvitationResponse);
  });

  test("Invitation should return an invitation", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitation));

    const response = await sdk.Domains.getInvitation(userId, domainId, token);
    expect(response).toEqual(invitation);
  });

  test("listInvitations should return a list of domain invitations", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitationsPage));

    const response = await sdk.Domains.listInvitations(queryParams, domainId, token);
    expect(response).toEqual(invitationsPage);
  });

  test("listUserInvitations should return a list of user invitations", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitationsPage));

    const response = await sdk.Domains.listUserInvitations(queryParams, token);
    expect(response).toEqual(invitationsPage);
  });

  test("Accept invitation should accept an invitation", async () => {
    const AcceptInvitationResponse = {
      status: 200,
      message: "Invitation accepted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(AcceptInvitationResponse));

    const response = await sdk.Domains.acceptInvitation(domainId, token);
    expect(response).toEqual(AcceptInvitationResponse);
  });

  test("Reject invitation should reject an invitation", async () => {
    const RejectInvitationResponse = {
      status: 200,
      message: "Invitation rejected successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(RejectInvitationResponse));

    const response = await sdk.Domains.rejectInvitation(domainId, token);
    expect(response).toEqual(RejectInvitationResponse);
  });

  test("Delete invitation should delete an invitation", async () => {
    const DeleteInvitationResponse = {
      status: 200,
      message: "Invitation deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(DeleteInvitationResponse));

    const response = await sdk.Domains.deleteInvitation(
      userId,
      domainId,
      token,
    );
    expect(response).toEqual(DeleteInvitationResponse);
  });
});
