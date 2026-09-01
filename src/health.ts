// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import type { HealthInfo } from "./defs";
import Errors from "./errors";

export default class Health {
  private readonly bootstrapUrl?: URL;

  private readonly certsUrl?: URL;

  private readonly readersUrl?: URL;

  private readonly httpAdapterUrl?: URL;

  private readonly journalUrl?: URL;

  private readonly authUrl?: URL;

  private readonly healthEndpoint: string;

  public constructor({
    bootstrapUrl,
    certsUrl,
    readersUrl,
    httpAdapterUrl,
    journalUrl,
    authUrl,
  }: {
    bootstrapUrl?: string;
    certsUrl?: string;
    readersUrl?: string;
    httpAdapterUrl?: string;
    journalUrl?: string;
    authUrl?: string;
  }) {
    if (bootstrapUrl !== undefined) {
      this.bootstrapUrl = new URL(bootstrapUrl);
    }
    if (certsUrl !== undefined) {
      this.certsUrl = new URL(certsUrl);
    }
    if (readersUrl !== undefined) {
      this.readersUrl = new URL(readersUrl);
    }
    if (httpAdapterUrl !== undefined) {
      this.httpAdapterUrl = new URL(httpAdapterUrl);
    }
    if (journalUrl !== undefined) {
      this.journalUrl = new URL(journalUrl);
    }
    if (authUrl !== undefined) {
      this.authUrl = new URL(authUrl);
    }
    this.healthEndpoint = "health";
  }

  public async check(service: string): Promise<HealthInfo> {
    let url: URL | undefined;
    switch (service) {
      case "bootstrap": {
        url = this.bootstrapUrl;
        break;
      }
      case "certs": {
        url = this.certsUrl;
        break;
      }
      case "reader": {
        url = this.readersUrl;
        break;
      }
      case "http-adapter": {
        url = this.httpAdapterUrl;
        break;
      }
      case "journal": {
        url = this.journalUrl;
        break;
      }
      case "pats": {
        url = this.authUrl;
        break;
      }
      default: {
        break;
      }
    }
    try {
      const response = await fetch(
        new URL(this.healthEndpoint, url).toString()
      );
      if (!response.ok) {
        throw Errors.HandleError(
          await Errors.ParseErrorMessage(response),
          response.status
        );
      }
      const userData: HealthInfo = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }
}
