// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import {
  ReportConfig,
  ReportConfigPage,
  ReportPage,
  Response,
  RulesPageMetadata,
  Schedule,
  Template,
  Role,
  RolePage,
  PageMetadata,
  BasicPageMeta,
  MemberRolesPage,
  MembersPage,
  MembersRolePageQuery,
} from "./defs";
import Errors from "./errors";
import Roles from "./roles";

/**
 * @class Reports
 * Handles interactions with the reports API, including creating, retrieving, updating,
 * enabling/disabling, deleting, and downloading reports and report configurations.
 */
export default class Reports {
  private readonly contentType: string;

  private readonly reportsEndpoint: string;

  private readonly configsEndpoint: string;

  private readonly reportsUrl: URL;

  private readonly reportRoles: Roles;

  /**
   * @constructor
   * Initializes the Reports API client.
   * @param {object} config - Configuration object.
   * @param {string} config.reportsUrl - Base URL for the reports API.
   */
  public constructor({ reportsUrl }: { reportsUrl: string }) {
    this.reportsUrl = new URL(reportsUrl);
    this.contentType = "application/json";
    this.reportsEndpoint = "reports";
    this.configsEndpoint = "configs";
    this.reportRoles = new Roles();
  }

  /**
   * Generates a report using a provided report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {ReportConfig} reportConfig - Configuration for generating the report.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportPage>} - The generated report data.
   * @throws {Error} - If the report generation fails.
   */
  public async generateReport(
    domainId: string,
    reportConfig: ReportConfig,
    token: string
  ): Promise<ReportPage> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportConfig),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.reportsEndpoint}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const report: ReportPage = await response.json();
      return report;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a new report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {ReportConfig} reportConfig - Report configuration to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The added report configuration.
   * @throws {Error} - If the configuration cannot be added.
   */
  public async addReportConfig(
    domainId: string,
    reportConfig: ReportConfig,
    token: string
  ): Promise<ReportConfig> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportConfig),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const newReportConfig: ReportConfig = await response.json();
      return newReportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a report configuration by ID.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} configId - The unique ID of the config.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The requested report configuration.
   * @throws {Error} - If the configuration cannot be fetched.
   */
  public async viewReportConfig(
    domainId: string,
    configId: string,
    token: string
  ): Promise<ReportConfig> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${configId}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const reportConfig: ReportConfig = await response.json();
      return reportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists report configurations with optional query parameters.
   * @param {string} domainId - The unique ID of the domain.
   * @param {RulesPageMetadata} queryParams - Query parameters for pagination and filtering.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfigPage>} - Paginated report configurations.
   * @throws {Error} - If configurations cannot be listed.
   */
  public async listReportConfigs(
    domainId: string,
    queryParams: RulesPageMetadata,
    token: string
  ): Promise<ReportConfigPage> {
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
          `${domainId}/${this.reportsEndpoint}/${
            this.configsEndpoint
          }?${new URLSearchParams(stringParams).toString()}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const reportConfigs: ReportConfigPage = await response.json();
      return reportConfigs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {ReportConfig} config - Report configuration with updated values.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The updated report configuration.
   * @throws {Error} - If the configuration cannot be updated.
   */

  public async updateReportConfig(
    domainId: string,
    config: ReportConfig,
    token: string
  ): Promise<ReportConfig> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${config.id}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedReportConfig: ReportConfig = await response.json();
      return updatedReportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing report schedule.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} configId - The unique ID of the config.
   * @param {Schedule} schedule - Report schedule with updated values.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The updated report config.
   * @throws {Error} - If the schedule cannot be updated.
   */

  public async updateReportSchedule(
    domainId: string,
    configId: string,
    schedule: Schedule,
    token: string
  ): Promise<ReportConfig> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${configId}/schedule`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedReportConfig: ReportConfig = await response.json();
      return updatedReportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} configId - The unique ID of the config.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} - Deletion status.
   * @throws {Error} - If the configuration cannot be deleted.
   */
  public async deleteReportConfig(
    domainId: string,
    configId: string,
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${configId}`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const statusResponse: Response = {
        status: response.status,
        message: "Report config deleted successfully",
      };
      return statusResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enables a report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} configId - The unique ID of the config.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The enabled report configuration.
   * @throws {Error} - If the configuration cannot be enabled.
   */
  public async enableReportConfig(
    domainId: string,
    configId: string,
    token: string
  ): Promise<ReportConfig> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${configId}/enable`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const enabledReportConfig: ReportConfig = await response.json();
      return enabledReportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disables a report configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} configId - The unique ID of the config.
   * @param {string} token - Authorization token.
   * @returns {Promise<ReportConfig>} - The disabled report configuration.
   * @throws {Error} - If the configuration cannot be disabled.
   */
  public async disableReportConfig(
    domainId: string,
    configId: string,
    token: string
  ): Promise<ReportConfig> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${configId}/disable`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const disabledReportConfig: ReportConfig = await response.json();
      return disabledReportConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates report template.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} reportId - The unique ID of the report.
   * @param {string} reportTemplate - Template for the report.
   * @param {string} token - Authorization token.
   * @returns {Promise<void>} - Resolves if the template was successfully updated.
   * @throws {Error} - If the configuration cannot be disabled.
   */
  public async updateReportTemplate(
    domainId: string,
    reportId: string,
    reportTemplate: string,
    token: string
  ): Promise<void> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ report_template: reportTemplate }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${reportId}/template`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Views report template.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} reportId - The unique ID of the report.
   * @param {string} token - Authorization token.
   * @returns {Promise<Template>} - The template used to generate report configuration.
   * @throws {Error} - If the report template cannot be retrieved.
   */
  public async viewReportTemplate(
    domainId: string,
    reportId: string,
    token: string
  ): Promise<Template> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${reportId}/template`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const template: Template = await response.json();
      return template;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes report template.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} reportId - The unique ID of the report.
   * @param {string} token - Authorization token.
   *  @returns {Promise<void>} - Resolves if the template was successfully deleted.
   * @throws {Error} - If the report template cannot be deleted.
   */
  public async deleteReportTemplate(
    domainId: string,
    reportId: string,
    token: string
  ): Promise<void> {
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
          `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}/${reportId}/template`,
          this.reportsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method listReportConfigActions - Lists all actions available for the report configs entity type.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves with an array of available actions.
   * @throws {Error} - If report config actions cannot be fetched.
   */
  public async listReportConfigActions(
    domainId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.reportRoles.ListAvailableActions(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}`,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method createReportConfigRole - Creates a new role within a specific report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} roleName - The name of the role to create.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @param {string[]} optionalActions - Optional actions assigned to the role.
   * @param {string[]} optionalMembers - Optional members assigned to the role.
   * @returns {Promise<Role>} role - A promise that resolves with the created role.
   * @throws {Error} - If the role cannot be created.
   */
  public async createReportConfigRole(
    configId: string,
    roleName: string,
    domainId: string,
    token: string,
    optionalActions?: string[],
    optionalMembers?: string[]
  ): Promise<Role> {
    try {
      const role: Role = await this.reportRoles.CreateRole(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method listReportConfigRoles - Lists all roles within a specific report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<RolePage>} rolePage - A promise that resolves with a page of roles.
   * @throws {Error} - If the roles cannot be fetched.
   */
  public async listReportConfigRoles(
    configId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<RolePage> {
    try {
      const rolesPage: RolePage = await this.reportRoles.ListRoles(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        queryParams,
        token
      );
      return rolesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method viewReportConfigRole - Retrieves details about a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} role - A promise that resolves with the role details.
   * @throws {Error} - If the role cannot be retrieved.
   */
  public async viewReportConfigRole(
    configId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Role> {
    try {
      const role: Role = await this.reportRoles.ViewRole(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        roleId,
        token
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method updateReportConfigRole - Updates the details of a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {Role} role - The role object with updated properties.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} role - A promise that resolves with the updated role.
   * @throws {Error} - If the role cannot be updated.
   */
  public async updateReportConfigRole(
    configId: string,
    domainId: string,
    roleId: string,
    role: Role,
    token: string
  ): Promise<Role> {
    try {
      const updatedRole: Role = await this.reportRoles.UpdateRole(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method deleteReportConfigRole - Deletes a specific role from a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when the role is deleted.
   * @throws {Error} - If the role cannot be deleted.
   */
  public async deleteReportConfigRole(
    configId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reportRoles.DeleteRole(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method addReportConfigRoleActions - Adds actions to a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to add to the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves with an array of actions.
   * @throws {Error} - If the actions cannot be added.
   */
  public async addReportConfigRoleActions(
    configId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response: string[] = await this.reportRoles.AddRoleActions(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method listReportConfigRoleActions - Lists all actions associated with a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves with an array of actions.
   * @throws {Error} - If actions cannot be retrieved.
   */
  public async listReportConfigRoleActions(
    configId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.reportRoles.ListRoleActions(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        roleId,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method deleteReportConfigRoleActions - Deletes specific actions from a role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - The actions to delete from the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteReportConfigRoleActions(
    configId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reportRoles.DeleteRoleActions(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method deleteAllReportConfigRoleActions - Deletes all actions associated with a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when all actions are deleted.
   * @throws {Error} - If the actions cannot be deleted.
   */
  public async deleteAllReportConfigRoleActions(
    configId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reportRoles.DeleteAllRoleActions(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method addReportConfigRoleMembers - Adds members to a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} members - A promise that resolves with an array of member IDs.
   * @throws {Error} - If the members cannot be added.
   */
  public async addReportConfigRoleMembers(
    configId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response: string[] = await this.reportRoles.AddRoleMembers(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method listReportConfigRoleMembers - Lists all members associated with a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {BasicPageMeta} queryParams - Pagination parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MembersPage>} membersPage - A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listReportConfigRoleMembers(
    configId: string,
    domainId: string,
    roleId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MembersPage> {
    try {
      const membersPage: MembersPage = await this.reportRoles.ListRoleMembers(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method deleteReportConfigRoleMembers - Deletes specific members from a role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - The IDs of the members to delete.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteReportConfigRoleMembers(
    configId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reportRoles.DeleteRoleMembers(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
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
   * @method deleteAllReportConfigRoleMembers - Deletes all members associated with a specific role in a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when all members are deleted.
   * @throws {Error} - If the members cannot be deleted.
   */
  public async deleteAllReportConfigRoleMembers(
    configId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response: Response = await this.reportRoles.DeleteAllRoleMembers(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method listReportConfigMembers - Lists all members associated with a report config.
   * @param {string} configId - The unique identifier of the report config.
   * @param {string} domainId - The unique ID of the domain.
   * @param {MembersRolePageQuery} queryParams - Pagination and filter parameters.
   * @param {string} token - Authorization token.
   * @returns {Promise<MemberRolesPage>} members - A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async listReportConfigMembers(
    configId: string,
    domainId: string,
    queryParams: MembersRolePageQuery,
    token: string
  ): Promise<MemberRolesPage> {
    try {
      const members: MemberRolesPage = await this.reportRoles.ListEntityMembers(
        this.reportsUrl,
        `${domainId}/${this.reportsEndpoint}/${this.configsEndpoint}`,
        configId,
        queryParams,
        token
      );
      return members;
    } catch (error) {
      throw error;
    }
  }
}
