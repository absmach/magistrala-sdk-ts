// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import type {
  Alarm,
  AlarmPageMeta,
  AlarmsPage,
  AlarmUpdate,
  Response,
} from "./defs";

/**
 * @class Alarms
 * @description A client for managing alarms via the Magistrala Alarms API.
 */
export default class Alarms {
  private readonly alarmsUrl: URL;

  private readonly contentType = "application/json";

  private readonly alarmsEndpoint = "alarms";

  /**
   * @constructor
   * @param {Object} config - Configuration object
   * @param {string} config.alarmsUrl - Base URL for the Alarms API.
   */
  constructor({ alarmsUrl }: { alarmsUrl: string }) {
    this.alarmsUrl = new URL(alarmsUrl);
  }

  /**
   * Lists all alarms within a domain, with optional pagination/filtering.
   * @param {AlarmPageMeta} queryParams - Query parameters for pagination/filtering.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<AlarmsPage>} - A page of alarms.
   * @throws {Error} - If the alarm list cannot be retrieved.
   */
  public async list(
    domainId: string,
    queryParams: AlarmPageMeta,
    token: string
  ): Promise<AlarmsPage> {
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
          `${domainId}/${this.alarmsEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.alarmsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const alarmsPage: AlarmsPage = await response.json();
      return alarmsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a single alarm by ID.
   * @param {string} alarmId - Unique alarm identifier.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Alarm>} - The requested alarm.
   * @throws {Error} - If the alarm cannot be fetched.
   */
  public async view(
    domainId: string,
    alarmId: string,
    token: string
  ): Promise<Alarm> {
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
          `${domainId}/${this.alarmsEndpoint}/${alarmId}`,
          this.alarmsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const alarm: Alarm = await response.json();
      return alarm;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Partially updates an existing alarm. Only the fields present in update are
   * changed; omitted fields are left untouched.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} alarmId - The unique ID of the alarm.
   * @param {AlarmUpdate} update - The fields to change.
   * @param {string} token - Authorization token.
   * @returns {Promise<Alarm>} - The updated alarm.
   * @throws {Error} - If the update fails.
   */
  public async update(
    domainId: string,
    alarmId: string,
    update: AlarmUpdate,
    token: string
  ): Promise<Alarm> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(update),
    };

    try {
      const response = await fetch(
        new URL(
          `${domainId}/${this.alarmsEndpoint}/${alarmId}`,
          this.alarmsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const updatedAlarm: Alarm = await response.json();
      return updatedAlarm;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an alarm by ID.
   * @param {string} alarmId - The unique ID of the alarm.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} - A success response object.
   * @throws {Error} - If the delete fails.
   */
  public async delete(
    domainId: string,
    alarmId: string,
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
          `${domainId}/${this.alarmsEndpoint}/${alarmId}`,
          this.alarmsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "Alarm deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }
}
