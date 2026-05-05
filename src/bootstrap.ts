// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import * as crypto from "crypto";
import Errors from "./errors";

import {
  type PageMetadata,
  type BootstrapConfig,
  type BootstrapPage,
  type Response,
} from "./defs";

/**
 * @class Bootstrap
 * Handles interactions with bootstrap API including creating, updating and managing bootstrap configurations.
 */
export default class Bootstrap {
  private readonly bootstrapUrl: URL;

  private readonly contentType: string;

  private readonly bootstrapEndpoint: string;

  private readonly configsEndpoint: string;

  private readonly whitelistEndpoint: string;

  private readonly bootstrapCertsEndpoint: string;

  private readonly bootstrapConnEndpoint: string;

  private readonly secureEndpoint: string;

  /**
   * @constructor
   * Initializes the Bootstrap API client.
   * @param {object} config - Configuration object.
   * @param {string} config.bootstrapUrl - Base URL for the bootstrap API.
   */
  public constructor({ bootstrapUrl }: { bootstrapUrl: string }) {
    this.bootstrapUrl = new URL(bootstrapUrl);
    this.contentType = "application/json";
    this.bootstrapEndpoint = "clients/bootstrap";
    this.configsEndpoint = "clients/configs";
    this.whitelistEndpoint = "clients/state";
    this.bootstrapCertsEndpoint = "clients/configs/certs";
    this.bootstrapConnEndpoint = "clients/configs/connections";
    this.secureEndpoint = "secure";
  }

  /**
   * Creates a new bootstrap configuration.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object containing details like external key, channels, externalId, clientId, etc.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration is created.
   * @throws {Error} - If the bootstrap configuration cannot be created.
   */
  public async add(
    bootstrapConfig: BootstrapConfig,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bootstrapConfig),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.configsEndpoint}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const createResponse: Response = {
        status: response.status,
        message: "Bootstrap configuration created",
      };
      return createResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a bootstrap configuration and changes the status of the config to whitelisted.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object containing details like external key, channels, externalId, clientId, etc.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration is whitelisted.
   * @throws {Error} - If the bootstrap configuration cannot be whitelisted.
   */
  public async whitelist(
    bootstrapConfig: BootstrapConfig,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state: bootstrapConfig.state }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.whitelistEndpoint}/${bootstrapConfig.client_id}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const whitelistResponse: Response = {
        status: response.status,
        message: "Bootstrap configuration state updated successfully",
      };
      return whitelistResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing bootstrap configuration's details.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object containing details like external key, channels, externalId, clientId, etc.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration is updated.
   * @throws {Error} - If the bootstrap configuration cannot be updated.
   */
  public async update(
    bootstrapConfig: BootstrapConfig,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bootstrapConfig),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.configsEndpoint}/${bootstrapConfig.client_id}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updateResponse: Response = {
        status: response.status,
        message: "Bootstrap configuration updated successfully",
      };
      return updateResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a bootstrap config by its ID.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapConfig>} The requested bootstrap configuration object.
   * @throws {Error} - If the bootstrap configuration cannot be fetched.
   */

  public async get(
    clientId: string,
    domainId: string,
    token: string
  ): Promise<BootstrapConfig> {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.configsEndpoint}/${clientId}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const bootstrapConfig: BootstrapConfig = await response.json();
      return bootstrapConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the details of a specific role in a domain.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object containing details like external key, channels, externalId, clientId, etc.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapConfig>} The updated bootstrap configuration.
   * @throws {Error} - If the certs cannot be updated.
   */
  public async updateCerts(
    bootstrapConfig: BootstrapConfig,
    domainId: string,
    token: string
  ): Promise<BootstrapConfig> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bootstrapConfig),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.bootstrapCertsEndpoint}/${bootstrapConfig.client_id}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedBootstrapConfig: BootstrapConfig = await response.json();
      return updatedBootstrapConfig;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes bootstrap configuration with specified id.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration is deleted.
   * @throws {Error} - If the bootstrap configuration cannot be deleted.
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
          `${domainId}/${this.configsEndpoint}/${clientId}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const removeResponse: Response = {
        status: response.status,
        message: "Bootstrap configuration deleted",
      };
      return removeResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a configuration with given external ID and encrypted external key.
   * @param {string} externalId - The external ID of the configuration to be retrieved.
   * @param {string} externalKey - The encrypted external key of the configuration to be retrieved.
   * @return {Promise<BootstrapConfig>} bootstrapConfig -  Returns the requested bootstrap configuration.
   * @throws {Error} - If the bootstrap configuration cannot be retrieved.
   */
  public async getByExternalId(
    externalId: string,
    externalKey: string
  ): Promise<BootstrapConfig> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Client ${externalKey}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.bootstrapEndpoint}/${externalId}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const bootstrap: BootstrapConfig = await response.json();
      return bootstrap;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all bootstrap configuration matching the provided query parameters.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} domainId -The unique ID of the domain.
   * @param {String} token - Authorization token.
   * @returns {Promise<BootstrapPage>} A page of bootstrap configurations.
   * @throws {Error} - If the bootstrap configurations cannot be fetched.
   */
  public async list(
    queryParams: PageMetadata,
    domainId: string,
    token: string
  ): Promise<BootstrapPage> {
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
          `${domainId}/${this.configsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const Bootstraps: BootstrapPage = await response.json();
      return Bootstraps;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the connection of a bootstrap configuration.
   * @param {string} clientId - The unique identifier of the client.
   * @param {string[]} channels - An array of unique channels ids to be updated.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration connection are updated.
   * @throws {Error} - If the bootstrap configuration cannot be updated.
   */
  public async updateConnection(
    clientId: string,
    domainId: string,
    channels: string[],
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channels }),
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.bootstrapConnEndpoint}/${clientId}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const connResponse: Response = {
        status: response.status,
        message: "Bootstrap connection successful",
      };
      return connResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Secures a bootstrap configuration by encrypting it.
   * @param {string} externalId - The unique external ID of the bootstrap configuration.
   * @param {string[]} externalKey - The unique external key of the bootstrap configuration.
   * @param {string} cryptoKey -The unique crypto key to be used to secure the bootstrap configuration.
   * @returns {Promise<BootstrapConfig>}  - bootstrapConfig -  Returns the secured bootstrap configuration.
   * @throws {Error} - If the bootstrap configuration cannot be scured.
   */
  public async getSecure(
    externalId: string,
    externalKey: string,
    cryptoKey: string
  ): Promise<BootstrapConfig> {
    const encryptedKey = await Bootstrap.bootstrapEncrypt(
      externalKey,
      cryptoKey
    );
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Client ${encryptedKey}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.bootstrapEndpoint}/${this.secureEndpoint}/${externalId}`,
          this.bootstrapUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const decryptedData = await Bootstrap.bootstrapDecrypt(
        JSON.stringify(options.body),
        cryptoKey
      );
      const secureBootstrap: BootstrapConfig = decryptedData;
      return secureBootstrap;
    } catch (error) {
      throw error;
    }
  }

  static async bootstrapEncrypt(
    text: string,
    cryptoKey: string
  ): Promise<string> {
    const bufferText = Buffer.from(text, "utf8");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cfb",
      Buffer.from(cryptoKey),
      iv
    );
    const encrypted = cipher.update(bufferText);
    const encryptedData = Buffer.concat([iv, encrypted]);
    return encryptedData.toString("hex");
  }

  static async bootstrapDecrypt(
    encryptedData: string,
    cryptoKey: string
  ): Promise<BootstrapConfig> {
    const encryptedBuffer = Buffer.from(encryptedData, "hex");
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv(
      "aes-256-cfb",
      Buffer.from(cryptoKey),
      iv
    );
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decryptedText = decrypted.toString("utf8");
    return JSON.parse(decryptedText);
  }
}
