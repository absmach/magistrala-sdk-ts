// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import {
  type Group,
  type GroupsPage,
  type PageMetadata,
  type Response,
  type Role,
  type RolePage,
  type BasicPageMeta,
  type HierarchyPageMeta,
  type HierarchyPage,
  type MemberRolesPage,
  type MembersPage,
  QueryParamRoles,
} from "./defs";
import Roles from "./roles";

/**
 * @class Groups -
 * Handles interactions with the groups API,  including creating, updating, and managing groups, roles, and permissions.
 */
export default class Groups {
  private readonly groupsUrl: URL;

  private readonly contentType: string;

  private readonly groupsEndpoint: string;

  private readonly groupRoles: Roles;

  /**
   * @constructor
   * Initializes the Groups API client.
   * @param {object} config - Configuration object.
   * @param {string} config.groupsUrl - Base URL for the groups API.
   */
  public constructor({ groupsUrl }: { groupsUrl: string }) {
    this.groupsUrl = new URL(groupsUrl);
    this.contentType = "application/json";
    this.groupsEndpoint = "groups";
    this.groupRoles = new Roles();
  }

  /**
   * @method CreateGroup - Creates a new group once the user is authenticated
   * and a valid token is provided. The group's parent or child status in the
   * heirarchy can also be established.
   * @param {Group} group - The group object to be created.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Group>} group - The created group object.
   * @throws {Error} - If the group cannot be created.
   */
  public async CreateGroup(
    group: Group,
    domainId: string,
    token: string
  ): Promise<Group> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(group),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const newGroup: Group = await response.json();
      return newGroup;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Group - Retrieves information about a group by its ID.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @param {boolean} [listRoles] - Whether to include roles in the response
   * @returns {Promise<Group>} The group object with its details.
   * @throws {Error} - If the group information cannot be retrieved.
   */
  public async Group(
    groupId: string,
    domainId: string,
    token: string,
    listRoles?: boolean
  ): Promise<Group> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const url = new URL(
        `${domainId}/${this.groupsEndpoint}/${groupId}`,
        this.groupsUrl
      );
      if (listRoles !== undefined) {
        url.searchParams.append(QueryParamRoles, String(listRoles));
      }
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const group: Group = await response.json();
      return group;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Groups - Retrieves a list of groups with pagination support.
   * @param {PageMetadata} queryParams - The query parameters for pagination (e.g., offset and limit).
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<GroupsPage>} groupsPage - A paginated list of groups.
   * @throws {Error} - If the groups cannot be retrieved.
   */
  public async Groups(
    queryParams: PageMetadata,
    domainId: string,
    token: string
  ): Promise<GroupsPage> {
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
          `${domainId}/${this.groupsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const groupsData: GroupsPage = await response.json();
      return groupsData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateGroup - Updates the information of an existing group.
   * @param {Group} group - The group object with updated details.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Group>} group - The updated group object.
   * @throws {Error} - If the group cannot be updated.
   */
  public async UpdateGroup(
    group: Group,
    domainId: string,
    token: string
  ): Promise<Group> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(group),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}/${group.id}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedGroup: Group = await response.json();
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateGroupTags - Updates an existing group's tags.
   * @param {Group} group - Group object with updated tags.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Group>} group - The updated group object.
   * @throws {Error} - If the group tags cannot be updated.
   */
  public async UpdateGroupTags(
    group: Group,
    domainId: string,
    token: string
  ): Promise<Group> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(group),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}/${group.id}/tags`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedGroup: Group = await response.json();
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method EnableGroup - Enables a disabled group by its ID.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Group>} group - The updated group object with enabled status.
   * @throws {Error} - If the group cannot be enabled.
   */
  public async EnableGroup(
    groupId: string,
    domainId: string,
    token: string
  ): Promise<Group> {
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
          `${domainId}/${this.groupsEndpoint}/${groupId}/enable`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const group: Group = await response.json();
      return group;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method DisableGroup - Disables an enabled group by its ID.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Group>} group - The updated group object with disabled status.
   * @throws {Error} - If the group cannot be disabled.
   */
  public async DisableGroup(
    groupId: string,
    domainId: string,
    token: string
  ): Promise<Group> {
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
          `${domainId}/${this.groupsEndpoint}/${groupId}/disable`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const group: Group = await response.json();
      return group;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method DeleteGroup - Deletes a group by its ID.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A response object confirming the deletion.
   * @throws {Error} - If the group cannot be deleted.
   */
  public async DeleteGroup(
    groupId: string,
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
          `${domainId}/${this.groupsEndpoint}/${groupId}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "Group deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method RetrieveGroupHierarchy - Retrieves the hierarchical structure of a group, including its parents and children.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {HierarchyPageMeta} queryParams - Pagination and query metadata.
   * @param {string} token - Authorization token.
   * @returns {Promise<HierarchyPage>} hierarchyPage - A promise that resolves to the group's hierarchical structure.
   * @throws {Error} - Throws an error if the hierarchy cannot be retrieved.
   */
  public async RetrieveGroupHierarchy(
    groupId: string,
    domainId: string,
    queryParams: HierarchyPageMeta,
    token: string
  ): Promise<HierarchyPage> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${
            this.groupsEndpoint
          }/${groupId}/hierarchy?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const page: HierarchyPage = await response.json();
      return page;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method addParentGroup - Adds a parent group to the specified group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} parentId - The unique identifier of the parent group.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the addition response.
   * @throws {Error} - Throws an error if the parent group cannot be added.
   */
  public async AddParentGroup(
    groupId: string,
    domainId: string,
    parentId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ parent_id: parentId }),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}/${groupId}/parent`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const addParentResponse: Response = {
        status: response.status,
        message: "Parent added successfully",
      };
      return addParentResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method removeParentGroup - Removes the parent group from the specified group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the removal response.
   * @throws {Error} - Throws an error if the parent group cannot be removed.
   */
  public async RemoveParentGroup(
    groupId: string,
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
          `${domainId}/${this.groupsEndpoint}/${groupId}/parent`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const removeParentResponse: Response = {
        status: response.status,
        message: "Parent removed successfully",
      };
      return removeParentResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method addChildrenGroups - Adds child groups to the specified group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string[]} childrenIds - List of unique identifiers of the child groups.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the addition response.
   * @throws {Error} - Throws an error if the child groups cannot be added.
   */
  public async AddChildrenGroups(
    groupId: string,
    domainId: string,
    childrenIds: string[],
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ children_ids: childrenIds }),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}/${groupId}/children`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const addParentResponse: Response = {
        status: response.status,
        message: "Children added successfully",
      };
      return addParentResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method removeChildrenGroups - Removes specific child groups from the specified group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string[]} childrenIds - List of unique identifiers of the child groups to remove.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the removal response.
   * @throws {Error} - Throws an error if the child groups cannot be removed.
   */
  public async RemoveChildrenGroups(
    groupId: string,
    domainId: string,
    childrenIds: string[],
    token: string
  ) {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ children_ids: childrenIds }),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.groupsEndpoint}/${groupId}/children`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const removeParentResponse: Response = {
        status: response.status,
        message: "Children removed successfully",
      };
      return removeParentResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method removeAllChildrenGroups - Removes all child groups from the specified group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the removal response.
   * @throws {Error} - Throws an error if the child groups cannot be removed.
   */
  public async RemoveAllChildrenGroups(
    groupId: string,
    domainId: string,
    token: string
  ) {
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
          `${domainId}/${this.groupsEndpoint}/${groupId}/children/all`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const removeParentResponse: Response = {
        status: response.status,
        message: "All children removed successfully",
      };
      return removeParentResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ListChildrenGroups - Retrieves a paginated list of a group's child groups.
   * @param {string} groupId - The unique identifier of the group.
   * @param {PageMetadata} queryParams - The query parameters for pagination (e.g., offset and limit).
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<GroupsPage>} groupsPage - A paginated list of the group's child groups.
   * @throws {Error} If the child groups cannot be retrieved.
   */
  public async ListChildrenGroups(
    groupId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<GroupsPage> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${
            this.groupsEndpoint
          }/${groupId}/children?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.groupsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }

      const groups: GroupsPage = await response.json();
      return groups;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method listGroupActions - Lists all available actions for groups within a specified domain.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves to an array of available actions.
   * @throws {Error} - Throws an error if the actions cannot be retrieved.
   */
  public async ListGroupActions(
    domainId: string,
    token: string
  ): Promise<string[]> {
    try {
      const actions: string[] = await this.groupRoles.ListAvailableActions(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        token
      );
      return actions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method createGroupRole - Creates a new role within a specific group and domain, with optional actions and members.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleName - The name of the role to be created.
   * @param {string} token - Authorization token.
   * @param {string[]} [optionalActions] - Optional list of actions for the role.
   * @param {string[]} [optionalMembers] - Optional list of members for the role.
   * @returns {Promise<Role>} role - A promise that resolves to the created role object.
   * @throws {Error} - Throws an error if the role cannot be created.
   */
  public async CreateGroupRole(
    groupId: string,
    domainId: string,
    roleName: string,
    token: string,
    optionalActions?: string[],
    optionalMembers?: string[]
  ): Promise<Role> {
    try {
      const role: Role = await this.groupRoles.CreateRole(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method listGroupRoles - Retrieves a paginated list of roles for a specific group within a domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {PageMetadata} queryParams - Pagination and query metadata.
   * @param {string} token - Authorization token.
   * @returns {Promise<RolePage>} rolesPage - A promise that resolves to a paginated list of roles.
   * @throws {Error} - Throws an error if the roles cannot be retrieved.
   */
  public async ListGroupRoles(
    groupId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<RolePage> {
    try {
      const rolesPage: RolePage = await this.groupRoles.ListRoles(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        queryParams,
        token
      );
      return rolesPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method viewGroupRole - Retrieves the details of a specific role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} role - A promise that resolves to the role details.
   * @throws {Error} - Throws an error if the role details cannot be retrieved.
   */
  public async ViewGroupRole(
    groupId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Role> {
    try {
      const role = await this.groupRoles.ViewRole(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        roleId,
        token
      );
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method updateGroupRole - Updates an existing role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {Role} role - The updated role object.
   * @param {string} token - Authorization token.
   * @returns {Promise<Role>} role - A promise that resolves to the updated role object.
   * @throws {Error} - Throws an error if the role cannot be updated.
   */
  public async UpdateGroupRole(
    groupId: string,
    domainId: string,
    roleId: string,
    role: Role,
    token: string
  ): Promise<Role> {
    try {
      const updatedRole = await this.groupRoles.UpdateRole(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method deleteGroupRole - Deletes a role within a specific group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the deletion response.
   * @throws {Error} - Throws an error if the role cannot be deleted.
   */
  public async DeleteGroupRole(
    groupId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.groupRoles.DeleteRole(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method AddGroupRoleActions - Adds actions to a specific role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - List of actions to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves to the update response.
   * @throws {Error} - Throws an error if the actions cannot be added.
   */
  public async AddGroupRoleActions(
    groupId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response = await this.groupRoles.AddRoleActions(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method listGroupRoleActions - Lists all actions associated with a specific role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} actions - A promise that resolves to a list of actions.
   * @throws {Error} - Throws an error if the actions cannot be retrieved.
   */
  public async ListGroupRoleActions(
    groupId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<string[]> {
    try {
      const updatedRole = await this.groupRoles.ListRoleActions(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        roleId,
        token
      );
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method deleteGroupRoleActions - Removes specific actions from a role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} actions - List of actions to remove.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the deletion response.
   * @throws {Error} - Throws an error if the actions cannot be removed.
   */
  public async DeleteGroupRoleActions(
    groupId: string,
    domainId: string,
    roleId: string,
    actions: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.groupRoles.DeleteRoleActions(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method deleteAllGroupRoleActions - Removes all actions from a role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the deletion response.
   * @throws {Error} - Throws an error if the actions cannot be removed.
   */
  public async DeleteAllGroupRoleActions(
    groupId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.groupRoles.DeleteAllRoleActions(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method addGroupRoleMembers - Adds members to a specific role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - List of members to add.
   * @param {string} token - Authorization token.
   * @returns {Promise<string[]>} members - A promise that resolves to the updated list of members.
   * @throws {Error} - Throws an error if the members cannot be added.
   */
  public async AddGroupRoleMembers(
    groupId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<string[]> {
    try {
      const response = await this.groupRoles.AddRoleMembers(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method listGroupRoleMembers - Lists all members associated with a specific role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {BasicPageMeta} queryParams - Pagination and query metadata.
   * @param {string} token - Authorization token.
   * @returns {Promise<MembersPage>} members - A promise that resolves to a list of members.
   * @throws {Error} - Throws an error if the members cannot be retrieved.
   */
  public async ListGroupRoleMembers(
    groupId: string,
    domainId: string,
    roleId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MembersPage> {
    try {
      const updatedRole = await this.groupRoles.ListRoleMembers(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method deleteGroupRoleMembers - Removes specific members from a role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string[]} members - List of members to remove.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the deletion response.
   * @throws {Error} - Throws an error if the members cannot be removed.
   */
  public async DeleteGroupRoleMembers(
    groupId: string,
    domainId: string,
    roleId: string,
    members: string[],
    token: string
  ): Promise<Response> {
    try {
      const response = await this.groupRoles.DeleteRoleMembers(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
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
   * @method deleteAllGroupRoleMembers - Removes all members from a role within a group and domain.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {string} roleId - The unique identifier of the role.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves to the deletion response.
   * @throws {Error} - Throws an error if the members cannot be removed.
   */
  public async DeleteAllGroupRoleMembers(
    groupId: string,
    domainId: string,
    roleId: string,
    token: string
  ): Promise<Response> {
    try {
      const response = await this.groupRoles.DeleteAllRoleMembers(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        roleId,
        token
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ListGroupMembers - Lists all members associated with a group.
   * @param {string} groupId - The unique identifier of the group.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<MemberRolePage>} members - A promise that resolves with a page of members.
   * @throws {Error} - If members cannot be retrieved.
   */
  public async ListGroupMembers(
    groupId: string,
    domainId: string,
    queryParams: BasicPageMeta,
    token: string
  ): Promise<MemberRolesPage> {
    try {
      const members = await this.groupRoles.ListEntityMembers(
        this.groupsUrl,
        `${domainId}/${this.groupsEndpoint}`,
        groupId,
        queryParams,
        token
      );
      return members;
    } catch (error) {
      throw error;
    }
  }
}
