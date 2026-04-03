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
   * @param {string} httpAdapterUrl - The URL of the Magistrala HTTP adapter.
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

  private static toBase64(msg: string): string {
    const bufferCtor = (globalThis as any).Buffer;
    if (typeof bufferCtor !== "undefined") {
      return bufferCtor.from(msg, "utf-8").toString("base64");
    }

    const bytes = new TextEncoder().encode(msg);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  private static authHeader(secret: string): string {
    if (secret.startsWith("Bearer ") || secret.startsWith("Client ")) {
      return secret;
    }
    return `Bearer ${secret}`;
  }

  /**
   * @method Send- Sends message to a given Channel via HTTP adapter. The client and Channel must exist and the client connected to the Channel.
   * @param {string} domainId - The unique ID of the domain of the channel and the client.
   * @param {string} topic - Channel topic in format `<channel_id>/<subtopic...>` where subtopic is optional.
   * @param {string} msg - Message to send to the Channel that should be in encoded into
   *       bytes format for example:
   *       [{"bn":"demo", "bu":"V", "n":"voltage", "u":"V", "v":5}]
   * @param {string} secret - The secret of the client sending the message.
   * @returns {Promise<Response>} response - A promise that resolves when the message is sent.
   * @throws {Error} - If the message cannot be sent.
   */
  public async Send(
    domainId: string,
    topic: string,
    msg: string,
    secret: string
  ): Promise<Response> {
    const topicParts = topic.split("/");
    const chanId = topicParts.shift()!;
    let brokerTopic = `m/${domainId}/c/${chanId}`;
    if (topicParts.length > 0) {
      brokerTopic = `${brokerTopic}/${topicParts.join("/")}`;
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: Messages.authHeader(secret),
        "X-FluxMQ-Username": domainId,
      },
      body: JSON.stringify({
        topic: brokerTopic,
        payload: Messages.toBase64(msg),
        qos: 0,
        retain: false,
      }),
    };
    try {
      const response = await fetch(new URL("publish", this.httpAdapterUrl).toString(), options);
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
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} channelId - Channel in format `<channel_id>/<subtopic...>` where subtopic is optional.
   * @param {MessagesPageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<MessagesPage>} messagesPage - A page of messages.
   * @throws {Error} - If the messages cannot be fetched.
   */
  public async Read(
    domainId: string,
    channelId: string,
    pm: MessagesPageMetadata,
    token: string
  ): Promise<MessagesPage> {
    const params = new URLSearchParams();
    Object.entries(pm).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const chanNameParts = channelId.split("/");
    const chanId = chanNameParts[0];
    if (chanNameParts.length > 1 && !params.has("subtopic")) {
      params.set("subtopic", chanNameParts.slice(1).join("/"));
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const requestURL = new URL(`${domainId}/channels/${chanId}/messages`, this.readersUrl);
      if (params.size > 0) {
        requestURL.search = params.toString();
      }
      const response = await fetch(
        requestURL.toString(),
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
