import Errors from './errors'
import type {
  Domain,
  PageMetadata,
  DomainsPage,
  Permissions,
  Response,
  UsersPage,
  Relation
} from './defs'

export default class Domains {
  // Domains API client

  private readonly domainsUrl: URL
  private readonly usersUrl?: URL
  private readonly contentType: string
  private readonly domainsEndpoint: string
  private readonly domainError: Errors

  public constructor ({ domainsUrl, usersUrl }: { domainsUrl: string, usersUrl?: string }) {
    this.domainsUrl = new URL(domainsUrl)
    if (usersUrl !== undefined) {
      this.usersUrl = new URL(usersUrl)
    } else {
      this.usersUrl = new URL('')
    }
    this.contentType = 'application/json'
    this.domainsEndpoint = 'domains'
    this.domainError = new Errors()
  }

  public async CreateDomain (domain: Domain, token: string): Promise<Domain> {
    // CreateDomain creates a new domain.

    /**
     * @method CreateDomain - Creates a new domain.
     * @param {object} domain - Domain object.
     * @param {string} token - User token with.
     * @returns {object} - returns an object Domain
     * @example
     * const domain = {
     *  name: "domainName",
     *  alias: "domainAlias",
     * }
     *
     */
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(domain)
    }

    try {
      const response = await fetch(
        new URL(this.domainsEndpoint, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: Domain = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async UpdateDomain (domain: Domain, token: string): Promise<Domain> {
    // UpdateDomain updates an existing domain.

    /**
     * @method UpdateDomain - Updates an existing domain's name and metadata.
     * @param {object} domain - Domain object.
     * @param {string} token - User token with domain access.
     * @returns {object} - returns an object Domain.
     */
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(domain)
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domain.id}`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: Domain = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async Domain (domainID: string, token: string): Promise<Domain> {
    // Domain retrieves domain with provided ID.

    /**
     * @method Domain - retrieves domain with provided ID.
     * @param {string} domainID - domain ID.
     * @param {string} token - user token.
     * @returns {object} - returns an object domain.
     */
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: Domain = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async DomainPermissions (domainID: string, token: string): Promise<Permissions> {
    // DomainPermissions retrieves domain permissions with provided ID.
    /**
     * @method DomainPermissions - retrieves domain permissions with provided ID.
     * @param {string} domainID - domain ID.
     * @param {string} token - user token.
     * @returns {object} - returns an object domain permissions eg:
     *  { permissions: [ 'admin', 'edit', 'view', 'membership' ] }
     * @example
     * const domainID = "domainID";
     */
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}/permissions`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: Permissions = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async Domains (queryParams: PageMetadata, token: string): Promise<DomainsPage> {
    // Domains retrieves all domains.
    /**
     * @method Domains - retrieves all domains with provided query parameters.
     * @param {object} queryParams - query parameters.
     * @param {string} token - user token.
     * @returns {object} - returns an object DomainsPage that shows a list of domains.
     */
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    )
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}?${new URLSearchParams(stringParams).toString()}`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: DomainsPage = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async ListUserDomains (userID: string, queryParams: PageMetadata, token: string): Promise<DomainsPage> {
    // ListUserDomains retrieves all domains for a user.
    /**
     * @method ListUserDomains - retrieves all domains for a user with provided query parameters.
     * @param {string} userID - user ID.
     * @param {object} queryParams - query parameters such as total, offset, limit.
     * @param {string} token - user token.
     * @returns {object} - returns an object DomainsPage that shows a list of domains.
     */
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    )
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`/users/${userID}/domains?${new URLSearchParams(stringParams).toString()}`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: DomainsPage = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async ListDomainUsers (domainID: string, queryParams: PageMetadata, token: string): Promise<UsersPage> {
    // ListDomainUsers returns list of users for the given domain ID and filters.
    /**
     * @method ListDomainUsers - retrieves all users for a domain with provided query parameters.
     * @param {string} domainID - domain ID.
     * @param {object} queryParams - query parameters such as total, offset, limit.
     * @param {string} token - user token.
     * @returns {object} - returns an object UsersPage that shows a list of users.
     */
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    )
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`/domains/${domainID}/users?${new URLSearchParams(stringParams).toString()}`, this.usersUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const domainData: UsersPage = await response.json()
      return domainData
    } catch (error) {
      throw error
    }
  }

  public async EnableDomain (domainID: string, token: string): Promise<Response> {
    // EnableDomain enables domain with provided ID.
    /**
     * @method EnableDomain - Enables domain with provided ID.
     * @param {string} domainID - domain ID.
     * @param {string} token - user token.
     * @returns {object} - returns an object Response that carries the status code and a response message.
     */
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}/enable`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const enableResponse: Response = { status: response.status, message: 'Domain enabled successfully' }
      return enableResponse
    } catch (error) {
      throw error
    }
  }

  public async DisableDomain (domainID: string, token: string): Promise<Response> {
    // DisableDomain disables domain with provided ID.
    /**
     * @method DisableDomain - Disables domain with provided ID.
     * @param {string} domainID - domain ID.
     * @param {string} token - user token.
     * @returns {object} - returns an object Response that carries the status code and a response message.
     */
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}/disable`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const disableResponse: Response = { status: response.status, message: 'Domain disabled successfully' }
      return disableResponse
    } catch (error) {
      throw error
    }
  }

  public async AddUsertoDomain (domainID: string, userIDs: string[], relation: Relation, token: string): Promise<Response> {
    // AddUsertoDomain adds user to domain.
    /**
     * @method AddUsertoDomain - Adds user to domain.
     * @param {string} domainID - domain ID.
     * @param {array} userIDs - array of user IDs.
     * @param {string} relation - user relation to domain such as 'administrator', 'member'.
     */
    const req = { user_ids: userIDs, relation }
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(req)
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}/users/assign`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const addResponse: Response = { status: response.status, message: 'User added successfully' }
      return addResponse
    } catch (error) {
      throw error
    }
  }

  public async RemoveUserfromDomain (domainID: string, userIDs: string[], relation: Relation, token: string): Promise<Response> {
    // RemoveUserfromDomain removes user from domain.
    /**
     * @method RemoveUserfromDomain - Removes user from domain.
     * @param {string} domainID - domain ID.
     * @param {array} userIDs - array of user IDs.
     * @param {string} relation - user relation to domain such as 'administrator', 'member'.
     * @returns {object} - returns an object Response that carries the status code and a response message.
     */
    const req = { user_ids: userIDs, relation }
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(req)
    }

    try {
      const response = await fetch(
        new URL(`${this.domainsEndpoint}/${domainID}/users/unassign`, this.domainsUrl).toString(),
        options
      )
      if (!response.ok) {
        const errorRes = await response.json()
        throw this.domainError.HandleError(errorRes.message, response.status)
      }
      const removeResponse: Response = { status: response.status, message: 'User removed successfully' }
      return removeResponse
    } catch (error) {
      throw error
    }
  }
}
