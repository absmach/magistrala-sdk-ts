// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import * as crypto from "crypto";
import Errors from "./errors";

import {
  type PageMetadata,
  type BootstrapConfig,
  type BootstrapPage,
  type BootstrapStatus,
  type BootstrapProfile,
  type BootstrapProfilesPage,
  type BootstrapBindingRequest,
  type BootstrapBindingSnapshot,
  type RenderPreviewRequest,
  type BindingSlot,
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

  private readonly bootstrapCertsEndpoint: string;

  private readonly bootstrapProfilesPath: string;

  private readonly bootstrapEnrollmentsPath: string;

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
    this.bootstrapCertsEndpoint = "clients/configs/certs";
    this.bootstrapProfilesPath = "clients/bootstrap/profiles";
    this.bootstrapEnrollmentsPath = "clients/bootstrap/enrollments";
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
  }

  /**
   * Updates a bootstrap configuration's status (enable or disable).
   * @param {string} id - The unique ID of the bootstrap configuration.
   * @param {BootstrapStatus} status - The new status ("enabled" or "disabled").
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the status is updated.
   * @throws {Error} - If the status cannot be updated.
   */
  public async updateStatus(
    id: string,
    status: BootstrapStatus,
    domainId: string,
    token: string
  ): Promise<Response> {
    if (status !== "enabled" && status !== "disabled") {
      throw new Error(
        `Invalid bootstrap status '${status}': must be 'enabled' or 'disabled'`
      );
    }
    const action = status === "enabled" ? "enable" : "disable";
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.configsEndpoint}/${id}/${action}`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const statusResponse: Response = {
      status: response.status,
      message: "Bootstrap configuration status updated successfully",
    };
    return statusResponse;
  }

  /**
   * Updates an existing bootstrap configuration's details.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object.
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
    if (!bootstrapConfig.id) {
      throw new Error("Bootstrap config id is required for update");
    }
    const { id, ...updateBody } = bootstrapConfig;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateBody),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.configsEndpoint}/${bootstrapConfig.id}`,
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
  }

  /**
   * Retrieves a bootstrap config by its ID.
   * @param {string} configId - The unique identifier of the configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapConfig>} The requested bootstrap configuration object.
   * @throws {Error} - If the bootstrap configuration cannot be fetched.
   */
  public async get(
    configId: string,
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
    const response = await fetch(
      new URL(
        `${domainId}/${this.configsEndpoint}/${configId}`,
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
  }

  /**
   * Updates the certs of a bootstrap configuration.
   * @param {BootstrapConfig} bootstrapConfig - The bootstrap configuration object containing cert fields.
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
    if (!bootstrapConfig.id) {
      throw new Error("Bootstrap config id is required for updateCerts");
    }
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bootstrapConfig),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapCertsEndpoint}/${bootstrapConfig.id}`,
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
  }

  /**
   * Deletes bootstrap configuration with specified id.
   * @param {string} configId - The unique ID of the configuration.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the bootstrap configuration is deleted.
   * @throws {Error} - If the bootstrap configuration cannot be deleted.
   */
  public async delete(
    configId: string,
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
    const response = await fetch(
      new URL(
        `${domainId}/${this.configsEndpoint}/${configId}`,
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
  }

  /**
   * Retrieves a configuration with given external ID and encrypted external key.
   * @param {string} externalId - The external ID of the configuration to be retrieved.
   * @param {string} externalKey - The encrypted external key of the configuration to be retrieved.
   * @return {Promise<BootstrapConfig>} Returns the requested bootstrap configuration.
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
  }

  /**
   * Retrieves all bootstrap configuration matching the provided query parameters.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
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
    const bootstraps: BootstrapPage = await response.json();
    return bootstraps;
  }

  /**
   * Creates a new bootstrap profile template.
   * @param {BootstrapProfile} profile - The bootstrap profile object.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapProfile>} The created bootstrap profile.
   */
  public async createProfile(
    profile: BootstrapProfile,
    domainId: string,
    token: string
  ): Promise<BootstrapProfile> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const saved: BootstrapProfile = await response.json();
    return saved;
  }

  /**
   * Uploads a bootstrap profile from a JSON, YAML, or TOML file.
   * @param {string} content - Raw file content.
   * @param {string} contentType - MIME type matching the file format (application/json, application/yaml, application/toml).
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapProfile>} The created bootstrap profile.
   */
  public async uploadProfile(
    content: string,
    contentType: string,
    domainId: string,
    token: string
  ): Promise<BootstrapProfile> {
    const allowedContentTypes = [
      "application/json",
      "application/yaml",
      "application/toml",
    ];
    if (!allowedContentTypes.includes(contentType)) {
      throw new Error(
        `Unsupported content type '${contentType}': must be one of ${allowedContentTypes.join(
          ", "
        )}`
      );
    }
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
      },
      body: content,
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/upload`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const saved: BootstrapProfile = await response.json();
    return saved;
  }

  /**
   * Retrieves a bootstrap profile by its ID.
   * @param {string} id - The unique ID of the bootstrap profile.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapProfile>} The requested bootstrap profile.
   */
  public async viewProfile(
    id: string,
    domainId: string,
    token: string
  ): Promise<BootstrapProfile> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/${id}`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const profile: BootstrapProfile = await response.json();
    return profile;
  }

  /**
   * Updates an existing bootstrap profile.
   * @param {BootstrapProfile} profile - The bootstrap profile object with updated fields.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the profile is updated.
   */
  public async updateProfile(
    profile: BootstrapProfile,
    domainId: string,
    token: string
  ): Promise<Response> {
    if (!profile.id) {
      throw new Error("Bootstrap profile id is required for update");
    }
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/${profile.id}`,
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
      message: "Bootstrap profile updated successfully",
    };
    return updateResponse;
  }

  /**
   * Retrieves a list of bootstrap profiles.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapProfilesPage>} A page of bootstrap profiles.
   */
  public async listProfiles(
    queryParams: PageMetadata,
    domainId: string,
    token: string
  ): Promise<BootstrapProfilesPage> {
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
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}?${new URLSearchParams(
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
    const page: BootstrapProfilesPage = await response.json();
    return page;
  }

  /**
   * Deletes a bootstrap profile by its ID.
   * @param {string} id - The unique ID of the bootstrap profile.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the profile is deleted.
   */
  public async deleteProfile(
    id: string,
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
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/${id}`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const deleteResponse: Response = {
      status: response.status,
      message: "Bootstrap profile deleted",
    };
    return deleteResponse;
  }

  /**
   * Assigns a bootstrap profile to an enrollment.
   * @param {string} configId - The unique ID of the bootstrap enrollment.
   * @param {string} profileId - The unique ID of the profile to assign.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the profile is assigned.
   */
  public async assignProfile(
    configId: string,
    profileId: string,
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profile_id: profileId }),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapEnrollmentsPath}/${configId}/profile`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const assignResponse: Response = {
      status: response.status,
      message: "Bootstrap profile assigned successfully",
    };
    return assignResponse;
  }

  /**
   * Stores resolved binding snapshots for a bootstrap enrollment.
   * @param {string} configId - The unique ID of the bootstrap enrollment.
   * @param {BootstrapBindingRequest[]} bindings - The bindings to store.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when bindings are stored.
   */
  public async bindResources(
    configId: string,
    bindings: BootstrapBindingRequest[],
    domainId: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bindings }),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapEnrollmentsPath}/${configId}/bindings`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const bindResponse: Response = {
      status: response.status,
      message: "Bootstrap resources bound successfully",
    };
    return bindResponse;
  }

  /**
   * Lists stored binding snapshots for a bootstrap enrollment.
   * @param {string} configId - The unique ID of the bootstrap enrollment.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BootstrapBindingSnapshot[]>} The list of binding snapshots.
   */
  public async listBindings(
    configId: string,
    domainId: string,
    token: string
  ): Promise<BootstrapBindingSnapshot[]> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapEnrollmentsPath}/${configId}/bindings`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const bindingsPage: { bindings?: BootstrapBindingSnapshot[] } =
      await response.json();
    return bindingsPage.bindings ?? [];
  }

  /**
   * Refreshes stored binding snapshots for a bootstrap enrollment.
   * @param {string} configId - The unique ID of the bootstrap enrollment.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when bindings are refreshed.
   */
  public async refreshBindings(
    configId: string,
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
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapEnrollmentsPath}/${configId}/bindings/refresh`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const refreshResponse: Response = {
      status: response.status,
      message: "Bootstrap bindings refreshed successfully",
    };
    return refreshResponse;
  }

  /**
   * Retrieves the binding slots for a bootstrap profile.
   * @param {string} profileId - The unique ID of the bootstrap profile.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<BindingSlot[]>} The list of binding slots defined by the profile.
   */
  public async profileSlots(
    profileId: string,
    domainId: string,
    token: string
  ): Promise<BindingSlot[]> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/${profileId}/slots`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const slotsPage: { binding_slots?: BindingSlot[] } = await response.json();
    return slotsPage.binding_slots ?? [];
  }

  /**
   * Renders a preview of a bootstrap profile template with the given context and bindings.
   * @param {string} profileId - The unique ID of the bootstrap profile.
   * @param {RenderPreviewRequest} request - The render context and optional bindings.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<string>} The rendered content string.
   */
  public async renderPreview(
    profileId: string,
    request: RenderPreviewRequest,
    domainId: string,
    token: string
  ): Promise<string> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    };
    const response = await fetch(
      new URL(
        `${domainId}/${this.bootstrapProfilesPath}/${profileId}/render-preview`,
        this.bootstrapUrl
      ).toString(),
      options
    );
    if (!response.ok) {
      const errorRes = await response.json();
      throw Errors.HandleError(errorRes.message, response.status);
    }
    const preview: { content?: string | null } = await response.json();
    if (preview.content === undefined || preview.content === null) {
      throw new Error("Render preview response missing content");
    }
    return preview.content;
  }

  /**
   * Secures a bootstrap configuration by encrypting it.
   * @param {string} externalId - The unique external ID of the bootstrap configuration.
   * @param {string} externalKey - The unique external key of the bootstrap configuration.
   * @param {string} cryptoKey - The unique crypto key to be used to secure the bootstrap configuration.
   * @returns {Promise<BootstrapConfig>} Returns the secured bootstrap configuration.
   * @throws {Error} - If the bootstrap configuration cannot be secured.
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
    const encryptedBody = await response.text();
    const decryptedData = await Bootstrap.bootstrapDecrypt(
      encryptedBody,
      cryptoKey
    );
    const secureBootstrap: BootstrapConfig = decryptedData;
    return secureBootstrap;
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
