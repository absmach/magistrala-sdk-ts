// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import type {
  DeviceTelemetry,
  JournalsPage,
  JournalsPageMetadata,
} from "./defs";
import Errors from "./errors";

/**
 * @class Journal
 * Handles interactions with Journal API.
 */
export default class Journal {
  private readonly journalsUrl: URL;

  private readonly journalsEndpoint: string;

  private readonly contentType: string;

  /**
   * @constructor
   * Initializes the Journal API client.
   * @param {object} config - Configuration object.
   * @param {string} config.journalsUrl - Base URL for the journal API.
   */
  public constructor({ journalUrl }: { journalUrl: string }) {
    this.journalsUrl = new URL(journalUrl);
    this.contentType = "application/json";
    this.journalsEndpoint = "journal";
  }

  /**
   * Retrieves journals for an entity by entity ID matching the provided query parameters.
   * @param {string} entityType - Entity type i.e client, channel or group.
   * @param {string} entityId - The unique ID of the entity.
   * @param {string} domainId - The unique ID of the domain.
   * @param {JournalsPageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<JournalsPage>} A page of journals.
   * @throws {Error} - If the journals cannot be fetched.
   */
  public async listByEntity(
    entityType: string,
    entityId: string,
    domainId: string,
    queryParams: JournalsPageMetadata,
    token: string
  ): Promise<JournalsPage> {
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
          `${domainId}/${
            this.journalsEndpoint
          }/${entityType}/${entityId}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.journalsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const journalsPage: JournalsPage = await response.json();
      return journalsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves journals for a user by user ID matching the provided query parameters.
   * @param {string} userId - The unique ID of the user.
   * @param {JournalsPageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<JournalsPage>} A page of journals.
   * @throws {Error} - If the journals cannot be fetched.
   */
  public async listByUser(
    userId: string,
    queryParams: JournalsPageMetadata,
    token: string
  ): Promise<JournalsPage> {
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
          `${this.journalsEndpoint}/user/${userId}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.journalsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const journalsPage: JournalsPage = await response.json();
      return journalsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves device telemetry.
   * @param {string} deviceId - The unique ID of the device.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<DeviceTelemetry>} A device telemetry object.
   * @throws {Error} - If device telemetry cannot be fetched.
   */
  public async deviceTelemetry(
    deviceId: string,
    domainId: string,
    token: string
  ): Promise<DeviceTelemetry> {
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
          `${domainId}/${this.journalsEndpoint}/client/${deviceId}/telemetry`,
          this.journalsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const deviceTelemetry: DeviceTelemetry = await response.json();
      return deviceTelemetry;
    } catch (error) {
      throw error;
    }
  }
}
