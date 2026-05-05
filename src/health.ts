// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import type { HealthInfo } from "./defs";
import Errors from "./errors";

export default class Health {
  private readonly usersUrl?: URL;

  private readonly clientsUrl?: URL;

  private readonly channelsUrl?: URL;

  private readonly bootstrapUrl?: URL;

  private readonly certsUrl?: URL;

  private readonly readersUrl?: URL;

  private readonly httpAdapterUrl?: URL;

  private readonly journalUrl?: URL;

  private readonly invitationsUrl?: URL;

  private readonly domainsUrl?: URL;

  private readonly groupsUrl?: URL;

  private readonly authUrl?: URL;

  private readonly healthEndpoint: string;

  public constructor({
    usersUrl,
    clientsUrl,
    channelsUrl,
    bootstrapUrl,
    certsUrl,
    readersUrl,
    httpAdapterUrl,
    journalUrl,
    invitationsUrl,
    domainsUrl,
    groupsUrl,
    authUrl,
  }: {
    usersUrl?: string;
    clientsUrl?: string;
    channelsUrl?: string;
    bootstrapUrl?: string;
    certsUrl?: string;
    readersUrl?: string;
    httpAdapterUrl?: string;
    journalUrl?: string;
    invitationsUrl?: string;
    domainsUrl?: string;
    groupsUrl?: string;
    authUrl?: string;
  }) {
    if (usersUrl !== undefined) {
      this.usersUrl = new URL(usersUrl);
    }
    if (clientsUrl !== undefined) {
      this.clientsUrl = new URL(clientsUrl);
    }
    if (channelsUrl !== undefined) {
      this.channelsUrl = new URL(channelsUrl);
    }
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
    if (invitationsUrl !== undefined) {
      this.invitationsUrl = new URL(invitationsUrl);
    }
    if (domainsUrl !== undefined) {
      this.domainsUrl = new URL(domainsUrl);
    }
    if (groupsUrl !== undefined) {
      this.groupsUrl = new URL(groupsUrl);
    }
    if (authUrl !== undefined) {
      this.authUrl = new URL(authUrl);
    }
    this.healthEndpoint = "health";
  }

  public async check(service: string): Promise<HealthInfo> {
    let url: URL | undefined;
    switch (service) {
      case "clients": {
        url = this.clientsUrl;
        break;
      }
      case "users": {
        url = this.usersUrl;
        break;
      }
      case "channels": {
        url = this.channelsUrl;
        break;
      }
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
      case "invitations": {
        url = this.invitationsUrl;
        break;
      }
      case "domains": {
        url = this.domainsUrl;
        break;
      }
      case "groups": {
        url = this.groupsUrl;
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
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: HealthInfo = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }
}
