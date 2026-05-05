// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import Roles from "./roles";
import {
  type Client,
  type ClientsPage,
  type Response,
  type PageMetadata,
  type Role,
  type RolePage,
  type BasicPageMeta,
  type MemberRolesPage,
  type MembersPage,
  QueryParamRoles,
} from "./defs";

/**
 * @class Clients -
 * Handles interactions with the clients API, including creating, updating, and managing clients, roles, and permissions.
 */
export default class Clients {
  private readonly clientsUrl: URL;

  private readonly contentType: string;

  private readonly clientsEndpoint: string;

  private readonly clientRoles: Roles;

  /**
   * @constructor
   * Initializes the Clients API client.
   * @param {object} config - Configuration object.
   * @param {string} config.clientsUrl - Base URL for the clients API.

   */
  public constructor({ clientsUrl }: { clientsUrl: string }) {
    this.clientsUrl = new URL(clientsUrl);

    this.contentType = "application/json";
    this.clientsEndpoint = "clients";
    this.clientRoles = new Roles();
  }

  /**
   * Creates a new client.
   * @param {Client} client - Client object containing details like name and metadata.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The created client object.
   * @throws {Error} - If the client cannot be created.
   */
  public async create(
    client: Client,
    domainId: string,
    token: string
  ): Promise<Client> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(client),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: Client = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates multiple new clients.
   * @param {Client[]} clients - An array of client objects, each containing details like name, metadata, and tags.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<ClientsPage>} A page of clients.
   * @throws {Error} - If the clients cannot be created.
   */
  public async createBulk(
    clients: Client[],
    domainId: string,
    token: string
  ): Promise<ClientsPage> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clients),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/bulk`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: ClientsPage = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enables a previously disabled client by its ID.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The updated client object with enabled status.
   * @throws {Error} - If the client cannot be enabled.
   */
  public async enable(
    clientId: string,
    domainId: string,
    token: string
  ): Promise<Client> {
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
          `${domainId}/${this.clientsEndpoint}/${clientId}/enable`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const enabledClient: Client = await response.json();
      return enabledClient;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disables an enabled client by its ID.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The updated client object with disabled status.
   * @throws {Error} - If the group cannot be disabled.
   */
  public async disable(
    clientId: string,
    domainId: string,
    token: string
  ): Promise<Client> {
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
          `${domainId}/${this.clientsEndpoint}/${clientId}/disable`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const disabledClient: Client = await response.json();
      return disabledClient;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the information of an existing client.
   * @param {Client} client - The client object.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The updated client object.
   * @throws {Error} - If the client cannot be updated.
   */
  public async update(
    client: Client,
    domainId: string,
    token: string
  ): Promise<Client> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(client),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${client.id}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: Client = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing client's secret.
   * @param {Client} client - Client object with updated secret.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The updated client object.
   * @throws {Error} - If the client secret cannot be updated.
   */
  public async updateSecret(
    client: Client,
    domainId: string,
    token: string
  ): Promise<Client> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ secret: client.credentials?.secret }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${client.id}/secret`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: Client = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing client's tags.
   * @param {Client} client - Client object with updated tags.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Client>} The updated client object.
   * @throws {Error} - If the client tags cannot be updated.
   */
  public async updateTags(
    client: Client,
    domainId: string,
    token: string
  ): Promise<Client> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(client),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${client.id}/tags`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: Client = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a client by its id.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @param {boolean} [listRoles] - Whether to include roles in the response
   * @returns {Promise<Client>} The requested client object.
   * @throws {Error} - If the client cannot be fetched.
   */
  public async get(
    clientId: string,
    domainId: string,
    token: string,
    listRoles?: boolean
  ): Promise<Client> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const url = new URL(
        `${domainId}/${this.clientsEndpoint}/${clientId}`,
        this.clientsUrl
      );
      if (listRoles !== undefined) {
        url.searchParams.append(QueryParamRoles, String(listRoles));
      }
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientData: Client = await response.json();
      return clientData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all clients matching the provided query parameters.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<ClientsPage>} A page of clients.
   * @throws {Error} - If the clients cannot be fetched.
   */
  public async list(
    queryParams: PageMetadata,
    domainId: string,
    token: string
  ): Promise<ClientsPage> {
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
          `${domainId}/${this.clientsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientsData: ClientsPage = await response.json();
      return clientsData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets parent to a client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} clientId - The unique ID of the client to be updated.
   * @param {string} parentGroupId - The unique ID of the group to be set as the parent.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the parent group is successfully set for the specified client.
   * @throws {Error} - If the parent group cannot be set for the client.
   */
  public async setParentGroup(
    domainId: string,
    clientId: string,
    parentGroupId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ parent_group_id: parentGroupId }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${clientId}/parent`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const addClientParentsResponse: Response = {
        status: response.status,
        message: "Client group parent added successfully",
      };
      return addClientParentsResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes the parent group from a specified client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the parent group is successfully removed from the specified client.
   * @throws {Error} - If the parent group cannot removed from the client.
   */
  public async deleteParentGroup(
    domainId: string,
    clientId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${clientId}/parent`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteClientParentsResponse: Response = {
        status: response.status,
        message: "Client group parent deleted successfully",
      };
      return deleteClientParentsResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a client with specified id.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the client is deleted.
   * @throws {Error} - If the client cannot be deleted.
   */
  public async delete(
    clientId: string,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.clientsEndpoint}/${clientId}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "Client deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all actions available to a specific client.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If client actions cannot be fetched.
   */
  public async listActions(
    domainId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.clientRoles.listAvailableActions(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new role within a specific client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} roleName - The name of the role to create.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @param {string[]} optionalActions - Optional actions assigned to the role.
   * @param {string[]} optionalMembers - Optional members assigned to the role.
   * @returns {Promise<Role>} A promise that resolves with the role created.
   * @throws {Error} - If the role cannot be created or already exists.
   */
  public async createRole(
    clientId: string,
    roleName: string,
    domainId: string,
    token: string,
    optionalActions?: string[],
    optionalMembers?: string[]
  ): Promise<Role> {
    try {
      const role: Role = await this.clientRoles.createRole(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Lists all roles within a specific client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<RolePage>} A promise that resolves with a page of roles in the domain.
   * @throws {Error} - If the client is invalid or roles cannot be fetched.
   */
  public async listRoles(
    clientId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<RolePage> {
    try {
      const rolesPage: RolePage = await this.clientRoles.listRoles(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        queryParams,
        token
      );
      return rolesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves details about a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the role details.
   * @throws {Error} - If the role does not exist or cannot be retrieved.
   */
  public async getRole(
    clientId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Role> {
    try {
      const role = await this.clientRoles.viewRole(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        roleId,
        token
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the details of a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {Role} role - The role to be updated.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the updated role.
   * @throws {Error} - If the role cannot be updated.
   */
  public async updateRole(
    clientId: string,
    domainId: string,
    roleId: string,
    role: Role,
    token: string
  ): Promise<Role> {
    try {
      const updatedRole = await this.clientRoles.updateRole(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Deletes a specific role from a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the role is deleted.
   * @throws {Error} - If the role cannot be deleted.
   */
  public async deleteRole(
    clientId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.clientRoles.deleteRole(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds actions to a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to add to the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If the actions cannot be added.
   */
  public async addRoleActions(
    clientId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response = await this.clientRoles.addRoleActions(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Lists all actions associated with a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If actions cannot be retrieved.
   */
  public async listRoleActions(
    clientId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<string[]> {
    try {
      const updatedRole = await this.clientRoles.listRoleActions(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        roleId,
        token
      );
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes specific actions from a role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to delete from the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteRoleActions(
    clientId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.clientRoles.deleteRoleActions(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Deletes all actions associated with a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteAllRoleActions(
    clientId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.clientRoles.deleteAllRoleActions(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds members to a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of member ids.
   * @throws {Error} - If the members cannot be added.
   */
  public async addRoleMembers(
    clientId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response = await this.clientRoles.addRoleMembers(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Lists all members associated with a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MembersPage>} A promise that resolves with an array of member ids.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listRoleMembers(
    clientId: string,
    domainId: string,
    roleId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MembersPage> {
    try {
      const updatedRole = await this.clientRoles.listRoleMembers(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Deletes specific members from a role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to delete.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteRoleMembers(
    clientId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.clientRoles.deleteRoleMembers(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
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
   * Deletes all members associated with a specific role in a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteAllRoleMembers(
    clientId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.clientRoles.deleteAllRoleMembers(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all members associated with a client.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MemberRolesPage>} A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listMembers(
    clientId: string,
    domainId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MemberRolesPage> {
    try {
      const members = await this.clientRoles.listEntityMembers(
        this.clientsUrl,
        `${domainId}/${this.clientsEndpoint}`,
        clientId,
        queryParams,
        token
      );
      return members;
    } catch (error) {
      throw error;
    }
  }
}
