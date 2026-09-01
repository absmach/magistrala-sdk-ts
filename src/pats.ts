// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import {
  PAT,
  PatPageMeta,
  PATsPage,
  Response,
  Scope,
  ScopesPage,
  ScopesPageMeta,
} from "./defs";
import Errors from "./errors";

/**
 * @class PATS
 * Handles interactions with the pats, including creating, updating, and managing pats.
 */

export default class PATs {
  private readonly authUrl: URL;

  private readonly contentType: string;

  private readonly patsEndpoint: string;

  /**
   * @constructor
   * Initializes the pats client.
   * @param {object} config - Configuration object.
   * @param {string} config.authUrl - Base URL for the pats API.
   */
  public constructor({ authUrl }: { authUrl: string }) {
    this.authUrl = new URL(authUrl);
    this.contentType = "application/json";
    this.patsEndpoint = "pats";
  }

  /**
   * Creates a new Personal Access Token (PAT).
   * @param {string} name -  The name of the PAT.
   * @param {string} duration - The validity duration of the PAT (e.g., "24h").
   * @param {string} description - The description of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The created PAT object.
   * @throws {Error} - If the PAT cannot be created.
   */

  public async create(
    name: string,
    duration: string,
    token: string,
    description?: string
  ): Promise<PAT> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, duration }),
    };

    try {
      const response = await fetch(
        new URL(this.patsEndpoint, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patData: PAT = await response.json();
      return patData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all Personal Access Tokens (PATs) matching the provided query parameters.
   * @param {PatPageMeta} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<PATsPage>} A page of PATs.
   * @throws {Error} - If the PATs cannot be fetched.
   */
  public async list(
    queryParams: PatPageMeta,
    token: string
  ): Promise<PATsPage> {
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
          `${this.patsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patsData: PATsPage = await response.json();
      return patsData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a Personal Access Token (PAT) by its ID.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The requested PAT object.
   * @throws {Error} - If the PAT cannot be fetched.
   */
  public async get(patId: string, token: string): Promise<PAT> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.patsEndpoint}/${patId}`, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patData: PAT = await response.json();
      return patData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes all Personal Access Tokens (PATs).
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the PATs are deleted.
   * @throws {Error} - If the PATs cannot be deleted.
   */
  public async deleteAll(token: string) {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(this.patsEndpoint, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "PATs deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the name of a Personal Access Token (PAT).
   * @param {string} name - The new name for the PAT.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The updated PAT object.
   * @throws {Error} - If the PAT name cannot be updated.
   */
  public async updateName(
    name: string,
    patId: string,
    token: string
  ): Promise<PAT> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    };

    try {
      const response = await fetch(
        new URL(`${this.patsEndpoint}/${patId}/name`, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patData: PAT = await response.json();
      return patData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the description of a Personal Access Token (PAT).
   * @param {string} description - The new description for the PAT.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The updated PAT object.
   * @throws {Error} - If the PAT description cannot be updated.
   */
  public async updateDescription(
    description: string,
    patId: string,
    token: string
  ): Promise<PAT> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.patsEndpoint}/${patId}/description`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patData: PAT = await response.json();
      return patData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a PAT with specified id.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the PAT is successfully deleted.
   * @throws {Error} - If the PAT cannot be deleted.
   */
  public async delete(patId: string, token: string) {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.patsEndpoint}/${patId}`, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "PAT deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resets the secret for a Personal Access Token (PAT).
   * @param {string} duration - The duration for which the new secret will be valid.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The updated PAT object with the new secret.
   * @throws {Error} - If the secret reset fails.
   */
  public async resetSecret(
    duration: string,
    patId: string,
    token: string
  ): Promise<PAT> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ duration }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.patsEndpoint}/${patId}/secret/reset`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const patData: PAT = await response.json();
      return patData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revokes a Personal Access Token (PAT).
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the PAT is revoked.
   * @throws {Error} - If the PAT revocation fails.
   */
  public async revoke(patId: string, token: string) {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.patsEndpoint}/${patId}/secret/revoke`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const revokeResponse: Response = {
        status: response.status,
        message: "PAT revoked successfully",
      };
      return revokeResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds scopes to a PAT.
   * @param {Scope[]} scopes - An array of scope.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<PAT>} The requested PAT object.
   * @throws {Error} - If the PAT cannot be fetched.
   */
  public async addScope(scopes: Scope[], patId: string, token: string) {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scopes }),
    };
    try {
      const response = await fetch(
        new URL(
          `${this.patsEndpoint}/${patId}/scope/add`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const addScopeResponse: Response = {
        status: response.status,
        message: "Scope added successfully",
      };
      return addScopeResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all scopes associated with a given PAT.
   * @param {string} patId - The unique ID of the PAT.
   * @param {ScopesPageMeta} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<ScopesPage>} A page of scopes.
   * @throws {Error} - If the scopes cannot be fetched.
   */
  public async listScopes(
    patId: string,
    queryParams: ScopesPageMeta,
    token: string
  ): Promise<ScopesPage> {
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
          `${this.patsEndpoint}/${patId}/scope?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const scopesData: ScopesPage = await response.json();
      return scopesData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes a scope from a PAT.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string[]} scopeIds - Array of scope IDs to remove.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the scopes are removed.
   * @throws {Error} - If the scopes cannot be removed.
   */
  public async deleteScopes(patId: string, scopeIds: string[], token: string) {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scopes_id: scopeIds }),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.patsEndpoint}/${patId}/scope/remove`,
          this.authUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const removeScopeResponse: Response = {
        status: response.status,
        message: "Scopes removed successfully",
      };
      return removeScopeResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes all scopes associated with a PAT.
   * @param {string} patId - The unique ID of the PAT.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the scopes are deleted.
   * @throws {Error} - If the scoped cannot be deleted.
   */
  public async deleteAllScopes(patId: string, token: string) {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.patsEndpoint}/${patId}/scope`, this.authUrl).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "All scopes deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }
}
