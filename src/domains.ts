// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import {
  type Domain,
  type PageMetadata,
  type DomainsPage,
  type Response,
  type Role,
  type BasicPageMeta,
  type RolePage,
  type MemberRolesPage,
  type MembersPage,
  type Invitation,
  type InvitationsPage,
  type InvitationPageMeta,
  QueryParamRoles,
} from "./defs";
import Roles from "./roles";

/**
 * @class Domains
 * Handles interactions with the domains API, including creating, updating, and managing domains, roles, and permissions.
 */
export default class Domains {
  private readonly domainsUrl: URL;

  private readonly contentType: string;

  private readonly domainsEndpoint: string;

  private readonly invitationsEndpoint: string;

  private readonly domainRoles: Roles;

  /**
   * @constructor
   * Initializes the Domains API client.
   * @param {object} config - Configuration object.
   * @param {string} config.domainsUrl - Base URL for the domains API.
   */
  public constructor({ domainsUrl }: { domainsUrl: string }) {
    this.domainsUrl = new URL(domainsUrl);
    this.contentType = "application/json";
    this.domainsEndpoint = "domains";
    this.invitationsEndpoint = "invitations";
    this.domainRoles = new Roles();
  }

  /**
   * Creates a new domain.
   * @param {Domain} domain - Domain object containing details like name and route.
   * @param {string} token - Authorization token.
   * @returns {Promise<Domain>} The created domain object.
   * @throws {Error} - If the domain cannot be created.
   */
  public async create(domain: Domain, token: string): Promise<Domain> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(domain),
    };

    try {
      const response = await fetch(
        new URL(this.domainsEndpoint, this.domainsUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const domainData: Domain = await response.json();
      return domainData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing domain's details.
   * @param {Domain} domain - Domain object with updated properties.
   * @param {string} token - Authorization token.
   * @returns {Promise<Domain>} The updated domain object.
   * @throws {Error} - If the domain cannot be updated.
   */
  public async update(domain: Domain, token: string): Promise<Domain> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(domain),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domain.id}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const domainData: Domain = await response.json();
      return domainData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a domain by its ID.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @param {boolean} [listRoles] - Whether to include roles in the response
   * @returns {Promise<Domain>} The requested domain object.
   * @throws {Error} - If the domain cannot be fetched.
   */
  public async get(
    domainId: string,
    token: string,
    listRoles?: boolean
  ): Promise<Domain> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const url = new URL(
        `${this.domainsEndpoint}/${domainId}`,
        this.domainsUrl
      );
      if (listRoles !== undefined) {
        url.searchParams.append(QueryParamRoles, String(listRoles));
      }
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const domainData: Domain = await response.json();
      return domainData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all domains matching the provided query parameters.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<DomainsPage>} A page of domains.
   * @throws {Error} - If the domains cannot be fetched.
   */
  public async list(
    queryParams: PageMetadata,
    token: string
  ): Promise<DomainsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const domainData: DomainsPage = await response.json();
      return domainData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all domains associated with a specific user.
   * @param {string} userId - The ID of the user.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<DomainsPage>} A page of domains associated with the user.
   * @throws {Error} - If the domains of a user cannot be fetched.
   */
  public async listByUser(
    userId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<DomainsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `/users/${userId}/domains?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const domainData: DomainsPage = await response.json();
      return domainData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enables a specific domain, making it active and accessible.
   * @param {string} domainId - The unique identifier of the domain to enable.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the domain is enabled.
   * @throws {Error} - If the domain cannot be enabled.
   */
  public async enable(
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/enable`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const enableResponse: Response = {
        status: response.status,
        message: "Domain enabled successfully",
      };
      return enableResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disables a specific domain, making it inactive and inaccessible.
   * @param {string} domainId - The unique identifier of the domain to disable.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the domain is disabled.
   * @throws {Error} - If the domain cannot be disabled.
   */
  public async disable(
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/disable`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const disableResponse: Response = {
        status: response.status,
        message: "Domain disabled successfully",
      };
      return disableResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Freezes the specified domain.
   * @param {string} domainId - The unique identifier of the domain to freeze.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the domain is frozen.
   * @throws {Error} - If the domain cannot be frozen.
   */
  public async freeze(
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/freeze`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const disableResponse: Response = {
        status: response.status,
        message: "Domain frozen successfully",
      };
      return disableResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all actions available in a specific domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If domain actions cannot be fetched.
   */
  public async listActions(token: string): Promise<string[]> {
    try {
      const actions: string[] = await this.domainRoles.listAvailableActions(
        this.domainsUrl,
        this.domainsEndpoint,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new role within a specific domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleName - The name of the role to create.
   * @param {string} token - Authorization token.
   * @param {string[]} optionalActions - Optional actions assigned to the role.
   * @param {string[]} optionalMembers - Optional members assigned to the role.
   * @returns {Promise<Role>} A promise that resolves with the role created.
   * @throws {Error} - If the role cannot be created or already exists.
   */
  public async createRole(
    domainId: string,
    roleName: string,
    token: string,
    optionalActions?: string[],
    optionalMembers?: string[]
  ): Promise<Role> {
    try {
      const role: Role = await this.domainRoles.createRole(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleName,
        token,
        optionalActions,
        optionalMembers
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all roles within a specific domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<RolePage>} A promise that resolves with a page of roles in the domain.
   * @throws {Error} - If the domainId is invalid or roles cannot be fetched.
   */
  public async listRoles(
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<RolePage> {
    try {
      const rolesPage: RolePage = await this.domainRoles.listRoles(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        queryParams,
        token
      );
      return rolesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves details about a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the role details.
   * @throws {Error} - If the role does not exist or cannot be retrieved.
   */
  public async getRole(
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Role> {
    try {
      const role = await this.domainRoles.viewRole(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        token
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the details of a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {Role} role - The role to be updated.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the updated role.
   * @throws {Error} - If the role cannot be updated.
   */
  public async updateRole(
    domainId: string,
    roleId: string,
    role: Role,
    token: string
  ): Promise<Role> {
    try {
      const updatedRole = await this.domainRoles.updateRole(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        role,
        token
      );
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a specific role from a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the role is deleted.
   * @throws {Error} - If the role cannot be deleted.
   */
  public async deleteRole(
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.domainRoles.deleteRole(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds actions to a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to add to the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If the actions cannot be added.
   */
  public async addRoleActions(
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ) {
    try {
      const response = await this.domainRoles.addRoleActions(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        actions,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all actions associated with a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If actions cannot be retrieved.
   */
  public async listRoleActions(
    domainId: string,
    roleId: string,
    token: string
  ): Promise<string[]> {
    try {
      const updatedRole = await this.domainRoles.listRoleActions(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        token
      );
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes specific actions from a role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to delete from the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteRoleActions(
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.domainRoles.deleteRoleActions(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        actions,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes all actions associated with a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteAllRoleActions(
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.domainRoles.deleteAllRoleActions(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds members to a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of member ids.
   * @throws {Error} - If the members cannot be added.
   */
  public async addRoleMembers(
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response = await this.domainRoles.addRoleMembers(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        members,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all members associated with a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MembersPage>} A promise that resolves with an array of member ids.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listRoleMembers(
    domainId: string,
    roleId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MembersPage> {
    try {
      const updatedRole = await this.domainRoles.listRoleMembers(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        queryParams,
        token
      );
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes specific members from a role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to delete.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteRoleMembers(
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.domainRoles.deleteRoleMembers(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        members,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes all members associated with a specific role in a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteAllRoleMembers(
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.domainRoles.deleteAllRoleMembers(
        this.domainsUrl,
        this.domainsEndpoint,
        domainId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all members associated with a domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MemberRolesPage>} A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listMembers(
    domainId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MemberRolesPage> {
    try {
      const members = await this.domainRoles.listEntityMembers(
        this.domainsUrl,
        `${this.domainsEndpoint}`,
        domainId,
        queryParams,
        token
      );
      return members;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sends an invitation to a given user.
   * @param {string} userId - The unique ID of the user.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique ID of the role.
   * @param {string} token - Authorization token.
   * @param {boolean} resend - Option to resend an invitation if it has been rejected.
   * @returns {Promise<Response>} A promise that resolves when the invitation is sent.
   * @throws {Error} - If the invitation cannot be sent.
   */
  public async sendInvitation(
    userId: string,
    domainId: string,
    roleId: string,
    token: string,
    resend?: boolean
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        invitee_user_id: userId,
        role_id: roleId,
        resend,
      }),
    };
    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/${this.invitationsEndpoint}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const inviteResponse: Response = {
        status: response.status,
        message: "Invitation sent successfully",
      };
      return inviteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the invitation for the given user to a given domain.
   * @param {string} userId - The unique ID of the user.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Invitation>} The invitation object.
   * @throws {Error} - If the invitation cannot be fetched.
   */
  public async getInvitation(
    userId: string,
    domainId: string,
    token: string
  ): Promise<Invitation> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/${this.invitationsEndpoint}/${userId}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const invitation: Invitation = await response.json();
      return invitation;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all domain invitations matching the provided query parameters.
   * @param {InvitationPageMeta} queryParams - Query parameters for the request.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<InvitationsPage>} A page of domain invitations.
   * @throws {Error} - If the domain invitations cannot be fetched.
   */
  public async listInvitations(
    queryParams: InvitationPageMeta,
    domainId: string,
    token: string
  ): Promise<InvitationsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/${
            this.invitationsEndpoint
          }?${new URLSearchParams(stringParams).toString()}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const invitationsPage: InvitationsPage = await response.json();
      return invitationsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all user invitations matching the provided query parameters.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<InvitationsPage>} A page of user invitations.
   * @throws {Error} - If the user invitations cannot be fetched.
   */
  public async listUserInvitations(
    queryParams: PageMetadata,
    token: string
  ): Promise<InvitationsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.invitationsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const invitationsPage: InvitationsPage = await response.json();
      return invitationsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Accepts an invitation by adding the user to the domain that they were invited to.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the invitation is accepted.
   * @throws {Error} - If the invitations cannot be accepted.
   */
  public async acceptInvitation(
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain_id: domainId }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.invitationsEndpoint}/accept`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const acceptResponse: Response = {
        status: response.status,
        message: "Invitation accepted successfully",
      };
      return acceptResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Rejects an invitation.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the invitation is rejected.
   * @throws {Error} - If the invitations cannot be rejected.
   */
  public async rejectInvitation(
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain_id: domainId }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.invitationsEndpoint}/reject`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const rejectResponse: Response = {
        status: response.status,
        message: "Invitation rejected successfully",
      };
      return rejectResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an invitation.
   * @param {string} userId - The unique ID of the user.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the invitation is deleted.
   * @throws {Error} - If the invitations cannot be deleted.
   */
  public async deleteInvitation(
    userId: string,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.domainsEndpoint}/${domainId}/${this.invitationsEndpoint}`,
          this.domainsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "Invitation deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }
}
