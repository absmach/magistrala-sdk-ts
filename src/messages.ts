// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";

import {
  type Response,
  type MessagesPage,
  type MessagesPageMetadata,
} from "./defs";

export default class Messages {
  // Messages API Client
  /**
   * @method Messages - Messages is used for sending and reading messages.
   * It provides methods for sending and reading messages.
   * @param {string} readersUrl - The url of the readers service.
   * @param {string} httpAdapterUrl - The URL of the Magistrala Messages adapter.
   * @param {string} contentType - The content type of the request.
   * @returns {Messages} - Returns a Messages object.
   */

  private readonly readersUrl: URL;

  private readonly httpAdapterUrl: URL;

  private readonly contentType: string;

  public constructor({
    readersUrl,
    httpAdapterUrl,
  }: {
    readersUrl: string;
    httpAdapterUrl: string;
  }) {
    this.readersUrl = new URL(readersUrl);
    this.httpAdapterUrl = new URL(httpAdapterUrl);
    this.contentType = "application/json";
  }

  /**
  * @method Send- Sends message to a given Channel via HTTP adapter. The client and Channel must exist and the client connected to the Channel.
  * @param {string} channelId - The ID of the Channel to send the message to.
  * @param {string} msg - Message to send to the Channel that should be in encoded into
  *       bytes format for example:
  *       [{"bn":"demo", "bu":"V", "n":"voltage", "u":"V", "v":5}]
  * @param {string} clientKey - The secret of the client sending the message.
  * @returns {Promise<Response>} response - A promise that resolves when the message is sent.
  * @throws {Error} - If the message cannot be sent.
  */
  public async Send(
    channelId: string,
    msg: string,
    clientKey: string
  ): Promise<Response> {
    const chanNameParts = channelId.split(".", 2);
    const chanId = chanNameParts[0];
    let subtopic = "";

    if (chanNameParts.length === 2) {
      subtopic = chanNameParts[1].replace(".", "/");
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Client ${clientKey}`,
      },
      body: msg,
    };
    try {
      const response = await fetch(
        new URL(
          `c/${chanId}/m${subtopic}`,
          this.httpAdapterUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const sendResponse: Response = {
        status: response.status,
        message: "Message sent successfully",
      };
      return sendResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
  *
  * @method Read - Read messages from a given channel.
  * @param {MessagesPageMetadata} queryParams - Query parameters for the request.
  * @param {string} channelId - The ID of the channel to read the message from.
  * @param {string} token - Authorization token.
  * @param {string} domainId - The unique ID of the domain.
  * @returns {Promise<MessagesPage>} messagesPage - A page of messages.
  * @throws {Error} - If the messages cannot be fetched.
  */
  public async Read(
    pm: MessagesPageMetadata,
    channelId: string,
    token: string,
    domainId: string
  ): Promise<MessagesPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(pm).map(([key, value]) => [key, String(value)])
    );
    const chanNameParts = channelId.split(".", 2);
    const chanId = chanNameParts[0];
    let subtopicPart = "";
    if (chanNameParts.length === 2) {
      subtopicPart = chanNameParts[1].replace(".", "/");
    }

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
          `${domainId}/channels/${chanId}/messages${subtopicPart}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.readersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const messageData: MessagesPage = await response.json();
      return messageData;
    } catch (error) {
      throw error;
    }
  }
}
