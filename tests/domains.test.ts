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

    const response = await sdk.domains.CreateDomain(domain, token);
    expect(response).toEqual(domain);
  });

  test("Domains should return a list of domains", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domainsPage));

    const response = await sdk.domains.Domains(queryParams, token);
    expect(response).toEqual(domainsPage);
  });

  test("Domain should return a domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domain));

    const response = await sdk.domains.Domain(domainId, token);
    expect(response).toEqual(domain);
  });

  test("Update should update a domain name and metadata", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domain));

    const response = await sdk.domains.UpdateDomain(domain, token);
    expect(response).toEqual(domain);
  });

  test("List user domains should return a list of user domains", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(domainsPage));

    const response = await sdk.domains.ListUserDomains(
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

    const response = await sdk.domains.EnableDomain(domainId, token);
    expect(response).toEqual(enableDomainResponse);
  });

  test("Disable domain should disable a domain", async () => {
    const disableDomainResponse = {
      status: 200,
      message: "Domain disabled successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(disableDomainResponse));

    const response = await sdk.domains.DisableDomain(domainId, token);
    expect(response).toEqual(disableDomainResponse);
  });

  test("Freeze domain should freeze a domain", async () => {
    const freezeDomainResponse = {
      status: 200,
      message: "Domain frozen successfully",
    };

    fetchMock.mockResponseOnce(JSON.stringify(freezeDomainResponse));

    const response = await sdk.domains.FreezeDomain(domainId, token);
    expect(response).toEqual(freezeDomainResponse);
  });

  test("ListDomainActions should return available actions", async () => {
    const availableActions = ["read", "write", "delete"];
    fetchMock.mockResponseOnce(
      JSON.stringify({ available_actions: availableActions })
    );

    const response = await sdk.domains.ListDomainActions(token);
    expect(response).toEqual(availableActions);
  });

  test("CreateDomainRole should create a new role and return it", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.domains.CreateDomainRole(
      domainId,
      roleName,
      token,
      actions,
      members
    );
    expect(response).toEqual(role);
  });

  test("ListDomainRoles should return a page of roles", async () => {
    const rolesPage = { roles: [role], total: 1, offset: 0, limit: 10 };
    fetchMock.mockResponseOnce(JSON.stringify(rolesPage));

    const response = await sdk.domains.ListDomainRoles(
      domainId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(rolesPage);
  });

  test("ViewDomainRole should return details of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(role));

    const response = await sdk.domains.ViewDomainRole(domainId, roleId, token);
    expect(response).toEqual(role);
  });

  test("UpdateDomainRole should update a role and return the updated role", async () => {
    const updatedRole = { ...role, actions: [...role.actions, "execute"] };
    fetchMock.mockResponseOnce(JSON.stringify(updatedRole));

    const response = await sdk.domains.UpdateDomainRole(
      domainId,
      roleId,
      updatedRole,
      token
    );
    expect(response).toEqual(updatedRole);
  });

  test("DeleteDomainRole should delete a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.domains.DeleteDomainRole(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("AddDomainRoleActions should add actions to a role and return updated actions", async () => {
    const updatedActions = [...actions, "execute"];
    fetchMock.mockResponseOnce(JSON.stringify({ actions: updatedActions }));

    const response = await sdk.domains.AddDomainRoleActions(
      domainId,
      roleId,
      ["execute"],
      token
    );
    expect(response).toEqual(updatedActions);
  });

  test("ListDomainRoleActions should return actions of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ actions }));

    const response = await sdk.domains.ListDomainRoleActions(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(actions);
  });

  test("DeleteDomainRoleActions should remove actions from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.domains.DeleteDomainRoleActions(
      domainId,
      roleId,
      ["write"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("DeleteAllDomainRoleActions should remove all actions from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role actions deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.domains.DeleteAllDomainRoleActions(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("AddDomainRoleMembers should add members to a role and return updated members", async () => {
    const updatedMembers = [...members, "user3"];
    fetchMock.mockResponseOnce(JSON.stringify({ members: updatedMembers }));

    const response = await sdk.domains.AddDomainRoleMembers(
      domainId,
      roleId,
      ["user3"],
      token
    );
    expect(response).toEqual(updatedMembers);
  });

  test("ListDomainRoleMembers should return members of a specific role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersPage));

    const response = await sdk.domains.ListDomainRoleMembers(
      domainId,
      roleId,
      { offset: 0, limit: 10 },
      token
    );
    expect(response).toEqual(membersPage);
  });

  test("DeleteDomainRoleMembers should remove members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.domains.DeleteDomainRoleMembers(
      domainId,
      roleId,
      ["user1"],
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("DeleteAllDomainRoleMembers should remove all members from a role response", async () => {
    const successResponse = {
      status: 200,
      message: "Role members deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.domains.DeleteAllDomainRoleMembers(
      domainId,
      roleId,
      token
    );
    expect(response).toEqual(successResponse);
  });

  test("List domain members should return members of a specific domain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersRolePage));

    const response = await sdk.domains.ListDomainMembers(
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

    const response = await sdk.domains.SendInvitation(userId, domainId, roleId, token);
    expect(response).toEqual(SendInvitationResponse);
  });

  test("Invitation should return an invitation", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitation));

    const response = await sdk.domains.ViewInvitation(userId, domainId, token);
    expect(response).toEqual(invitation);
  });

  test("ListDomainInvitations should return a list of domain invitations", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitationsPage));

    const response = await sdk.domains.ListDomainInvitations(queryParams, domainId, token);
    expect(response).toEqual(invitationsPage);
  });

  test("ListUserInvitations should return a list of user invitations", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(invitationsPage));

    const response = await sdk.domains.ListUserInvitations(queryParams, token);
    expect(response).toEqual(invitationsPage);
  });

  test("Accept invitation should accept an invitation", async () => {
    const AcceptInvitationResponse = {
      status: 200,
      message: "Invitation accepted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(AcceptInvitationResponse));

    const response = await sdk.domains.AcceptInvitation(domainId, token);
    expect(response).toEqual(AcceptInvitationResponse);
  });

  test("Reject invitation should reject an invitation", async () => {
    const RejectInvitationResponse = {
      status: 200,
      message: "Invitation rejected successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(RejectInvitationResponse));

    const response = await sdk.domains.RejectInvitation(domainId, token);
    expect(response).toEqual(RejectInvitationResponse);
  });

  test("Delete invitation should delete an invitation", async () => {
    const DeleteInvitationResponse = {
      status: 200,
      message: "Invitation deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(DeleteInvitationResponse));

    const response = await sdk.domains.DeleteInvitation(
      userId,
      domainId,
      token,
    );
    expect(response).toEqual(DeleteInvitationResponse);
  });
});
