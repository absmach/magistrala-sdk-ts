// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";

import {
  type Response,
  type MessagesPage,
  type MessagesPageMetadata,
} from "./defs";

export default class Messages {
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
   * Sends a message to a given channel via HTTP adapter. The client and channel must exist and the client must be connected to the channel.
   * @param {string} domainId - The unique ID of the domain of the channel and the client.
   * @param {string} topic - The topic to send the message to.
   * @param {string} msg - Message to send to the channel that should be encoded into
   *       bytes format for example:
   *       [{"bn":"demo", "bu":"V", "n":"voltage", "u":"V", "v":5}]
   * @param {string} secret - The secret of the client sending the message.
   * @returns {Promise<Response>} A promise that resolves when the message is sent.
   * @throws {Error} - If the message cannot be sent.
   */
  public async send(
    domainId: string,
    topic: string,
    msg: string,
    secret: string
  ): Promise<Response> {
    const topicParts = topic.split(".");
    const chanId = topicParts.shift()!;
    const adapterTopic = `m/${domainId}/c/${chanId}${topicParts.length ? `/${topicParts.join("/")}` : ""
    }`;

    const baseUrl = this.httpAdapterUrl.href.replace(/\/$/, "");
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/senml+json",
        Authorization: `Client ${secret}`,
      },
      body: msg,
    };
    try {
      const response = await fetch(`${baseUrl}/${adapterTopic}`, options);
      if (!response.ok) {
        const message = await response.text();
        throw Errors.HandleError(message.trim(), response.status);
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
   * Reads messages from a given channel.
   * @param {string} domainId - The unique ID of the domain.
   * @param {string} channelId - The ID of the channel to read the message from.
   * @param {MessagesPageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<MessagesPage>} A page of messages.
   * @throws {Error} - If the messages cannot be fetched.
   */
  public async read(
    domainId: string,
    channelId: string,
    pm: MessagesPageMetadata,
    token: string
  ): Promise<MessagesPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(pm).map(([key, value]) => [key, String(value)])
    );
    const [chanId, subtopic] = channelId.split(".", 2);

    if (subtopic) {
      stringParams.subtopic = subtopic;
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
          `${domainId}/channels/${chanId}/messages?${new URLSearchParams(
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
