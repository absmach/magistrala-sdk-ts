// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import {
  Rule,
  RulesPage,
  RulesPageMetadata,
  Response,
  Schedule,
  Role,
  RolePage,
  PageMetadata,
  BasicPageMeta,
  MemberRolesPage,
  MembersPage,
  MembersRolePageQuery,
  QueryParamRoles,
} from "./defs";
import Errors from "./errors";
import Roles from "./roles";

/**
 * @class Rules
 * Handles interactions with rules API, including creating, updating and managing rules, roles and permissions.
 */
export default class Rules {
  private readonly contentType: string;

  private readonly rulesEndpoint: string;

  private readonly rulesUrl: URL;

  private readonly reRoles: Roles;

  /**
   * @constructor
   * Initializes the Rules API client.
   * @param {object} config - Configuration object.
   * @param {string} config.rulesUrl - Base URL for the rules API.
   */
  public constructor({ rulesUrl }: { rulesUrl: string }) {
    this.rulesUrl = new URL(rulesUrl);
    this.contentType = "application/json";
    this.rulesEndpoint = "rules";
    this.reRoles = new Roles();
  }

  /**
   * Creates a new rule
   * @param {string} domainId - The unique ID of the domain.
   * @param {Rule} rule - Rule object with a containing details like name, input_channel, input_topic and logic.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The created rule object.
   * @throws {Error} - If the rule cannot be created.
   */
  public async create(
    domainId: string,
    rule: Rule,
    token: string
  ): Promise<Rule> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rule),
    };
    try {
      const response = await fetch(
        new URL(`${domainId}/${this.rulesEndpoint}`, this.rulesUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const newRule: Rule = await response.json();
      return newRule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a rule by its id.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The unique ID of the rule.
   * @param {string} token - Authorization token.
   * @param {boolean} [listRoles] - Whether to include roles in the response
   * @returns {Promise<Rule>} The requested rule object.
   * @throws {Error} - If the rule cannot be fetched.
   */
  public async view(
    domainId: string,
    ruleId: string,
    token: string,
    listRoles?: boolean
  ): Promise<Rule> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const url = new URL(
        `${domainId}/${this.rulesEndpoint}/${ruleId}`,
        this.rulesUrl
      );
      if (listRoles) {
        url.searchParams.append(QueryParamRoles, String(listRoles));
      }
      const response = await fetch(
        url.toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const rule: Rule = await response.json();
      return rule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all rules matching the provided query parameters.
   * @param {string} domainId - The unique ID of the domain.
   * @param {RulesPageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<RulesPage>} A page of rules.
   * @throws {Error} - If the rules cannot be fetched.
   */
  public async list(
    domainId: string,
    queryParams: RulesPageMetadata,
    token: string
  ): Promise<RulesPage> {
    // Unset filters are dropped rather than stringified. `mode` in particular is
    // absent when the caller wants every execution mode, and `String(undefined)`
    // would send the literal "undefined" for the server to reject.
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
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
          `${domainId}/${this.rulesEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const rulesPage: RulesPage = await response.json();
      return rulesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {Rule} rule - rule object with updated properties.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The updated rule object.
   * @throws {Error} - If the rule cannot be updated.
   */
  public async update(
    domainId: string,
    rule: Rule,
    token: string
  ): Promise<Rule> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rule),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${rule.id}`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedRule: Rule = await response.json();
      return updatedRule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing rule's tags.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The unique ID of the rule.
   * @param {string[]} tags - The updated tags for the rule.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The updated rule object.
   * @throws {Error} - If the rule cannot be updated.
   */
  public async updateTags(
    domainId: string,
    ruleId: string,
    tags: string[],
    token: string
  ): Promise<Rule> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tags }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${ruleId}/tags`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedRule: Rule = await response.json();
      return updatedRule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the schedule for a specific rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The ID of the rule whose schedule is to be updated.
   * @param {Schedule} schedule - The updated schedule object.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The updated rule object.
   * @throws {Error} - If the schedule cannot be updated.
   */
  public async updateSchedule(
    domainId: string,
    ruleId: string,
    schedule: Schedule,
    token: string
  ): Promise<Rule> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schedule }),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${ruleId}/schedule`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedSchedule: Rule = await response.json();
      return updatedSchedule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The  unique ID of the rule.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the rule is successfully deleted.
   * @throws {Error} - If the rule cannot be deleted.
   */
  public async delete(
    domainId: string,
    ruleId: string,
    token: string
  ): Promise<Response> {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${ruleId}`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const statusResponse: Response = {
        status: response.status,
        message: "Rule deleted successfully",
      };
      return statusResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enables a previously disabled rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The  unique ID of the rule.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The enabled rule object.
   * @throws {Error} - If the rule cannot be enabled.
   */
  public async enable(
    domainId: string,
    ruleId: string,
    token: string
  ): Promise<Rule> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${ruleId}/enable`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const enabledRule: Rule = await response.json();
      return enabledRule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disables a specific rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} ruleId - The  unique ID of the rule.
   * @param {string} token - Authorization token.
   * @returns {Promise<Rule>} The disabled rule object.
   * @throws {Error} - If the rule cannot be disabled.
   */
  public async disable(
    domainId: string,
    ruleId: string,
    token: string
  ): Promise<Rule> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.rulesEndpoint}/${ruleId}/disable`,
          this.rulesUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const disabledRule: Rule = await response.json();
      return disabledRule;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all actions available for the rules entity type.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of available actions.
   * @throws {Error} - If rule actions cannot be fetched.
   */
  public async listActions(
    domainId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.reRoles.listAvailableActions(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new role within a specific rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} roleName - The name of the role to create.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @param {string[]} optionalActions - Optional actions assigned to the role.
   * @param {string[]} optionalMembers - Optional members assigned to the role.
   * @returns {Promise<Role>} A promise that resolves with the created role.
   * @throws {Error} - If the role cannot be created.
   */
  public async createRole(
    ruleId: string,
    roleName: string,
    domainId: string,
    token: string,
    optionalActions?: string[],
    optionalMembers?: string[]
  ): Promise<Role> {
    try {
      const role: Role = await this.reRoles.createRole(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Lists all roles within a specific rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<RolePage>} A promise that resolves with a page of roles.
   * @throws {Error} - If the roles cannot be fetched.
   */
  public async listRoles(
    ruleId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<RolePage> {
    try {
      const rolesPage: RolePage = await this.reRoles.listRoles(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        queryParams,
        token
      );
      return rolesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves details about a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the role details.
   * @throws {Error} - If the role cannot be retrieved.
   */
  public async getRole(
    ruleId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Role> {
    try {
      const role: Role = await this.reRoles.viewRole(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        token
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the details of a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {Role} role - The role object with updated properties.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} A promise that resolves with the updated role.
   * @throws {Error} - If the role cannot be updated.
   */
  public async updateRole(
    ruleId: string,
    domainId: string,
    roleId: string,
    role: Role,
    token: string
  ): Promise<Role> {
    try {
      const updatedRole: Role = await this.reRoles.updateRole(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Deletes a specific role from a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the role is deleted.
   * @throws {Error} - If the role cannot be deleted.
   */
  public async deleteRole(
    ruleId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reRoles.deleteRole(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds actions to a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to add to the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If the actions cannot be added.
   */
  public async addRoleActions(
    ruleId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response: string[] = await this.reRoles.addRoleActions(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Lists all actions associated with a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of actions.
   * @throws {Error} - If actions cannot be retrieved.
   */
  public async listRoleActions(
    ruleId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.reRoles.listRoleActions(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes specific actions from a role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to delete from the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteRoleActions(
    ruleId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reRoles.deleteRoleActions(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Deletes all actions associated with a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteAllRoleActions(
    ruleId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reRoles.deleteAllRoleActions(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds members to a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} A promise that resolves with an array of member IDs.
   * @throws {Error} - If the members cannot be added.
   */
  public async addRoleMembers(
    ruleId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response: string[] = await this.reRoles.addRoleMembers(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Lists all members associated with a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MembersPage>} A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listRoleMembers(
    ruleId: string,
    domainId: string,
    roleId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MembersPage> {
    try {
      const membersPage: MembersPage = await this.reRoles.listRoleMembers(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        queryParams,
        token
      );
      return membersPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes specific members from a role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to delete.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteRoleMembers(
    ruleId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reRoles.deleteRoleMembers(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
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
   * Deletes all members associated with a specific role in a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when all members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteAllRoleMembers(
    ruleId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reRoles.deleteAllRoleMembers(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists all members associated with a rule.
   * @param {string} ruleId - The unique identifier of the rule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {MembersRolePageQuery} queryParams - Pagination and filter parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MemberRolesPage>} A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listMembers(
    ruleId: string,
    domainId: string,
    queryParams: MembersRolePageQuery,
    token: string
  ): Promise<MemberRolesPage> {
    try {
      const members: MemberRolesPage = await this.reRoles.listEntityMembers(
        this.rulesUrl,
        `${domainId}/${this.rulesEndpoint}`,
        ruleId,
        queryParams,
        token
      );
      return members;
    } catch (error) {
      throw error;
    }
  }
}
