// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import { type Cert, CertsPage, type Response } from "./defs";

/**
 *@class Certs
 * Handles interactions with certs API, including issuing, viewing, revoking certificates and manage certificates.
 */
export default class Certs {
  private readonly certsUrl: URL;

  private readonly contentType: string;

  private readonly certsEndpoint: string;

  constructor({ certsUrl }: { certsUrl: string }) {
    this.certsUrl = new URL(certsUrl);
    this.contentType = "application/json";
    this.certsEndpoint = "certs";
  }

  /**
   * Issues a certificate to a client.
   * @param {string} clientId - The unique ID of the client to be issued a certificate.
   * @param {string} valid - The time in hours for which the certificate is valid such as '10h'
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Cert>} A promise that resolves with the certificate issued.
   * @throws {Error} - If the certificate cannot be issued.
   */
  public async issue(
    clientId: string,
    valid: string,
    domainId: string,
    token: string
  ): Promise<Cert> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ client_id: clientId, ttl: valid }),
    };

    try {
      const response = await fetch(
        new URL(`${domainId}/${this.certsEndpoint}`, this.certsUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const cert: Cert = await response.json();
      return cert;
    } catch (error) {
      throw error;
    }
  }

  /**
   *  Retrieves all certs matching the provided client Id.
   * @param {string} clientId - The unique ID of the client.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<CertsPage>} A page of certs.
   * @throws {Error} - If the certs cannot be fetched.
   */
  public async listByClient(
    clientId: string,
    domainId: string,
    token: string
  ): Promise<CertsPage> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(`${domainId}/serials/${clientId}`, this.certsUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const certsPage: CertsPage = await response.json();
      return certsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a certificate by its id.
   * @param {string} certId - The  unique ID of the certificate.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Cert>} The requested cert object.
   * @throws {Error} - If the cert cannot be fetched.
   */
  public async get(
    certId: string,
    domainId: string,
    token: string
  ): Promise<Cert> {
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
          `${domainId}/${this.certsEndpoint}/${certId}`,
          this.certsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const cert: Cert = await response.json();
      return cert;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revokes and deletes a certificate with specified id.
   * @param {string} certId - The  unique ID of the certificate to be revoked.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} A promise that resolves when the cert is revoked.
   * @throws {Error} - If the cert cannot be revoked.
   */
  public async revoke(
    certId: string,
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
          `${domainId}/${this.certsEndpoint}/${certId}`,
          this.certsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const revokeResponse: Response = {
        status: response.status,
        message: "Cert revoked successfully",
      };
      return revokeResponse;
    } catch (error) {
      throw error;
    }
  }
}
