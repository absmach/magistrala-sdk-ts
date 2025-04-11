// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type { SenMLMessage, MessagesPage } from "../src/sdk";

enableFetchMocks();

const readersUrl = "http://localhost";
const httpAdapterUrl = "http://localhost";
const sdk = new SDK({ readersUrl, httpAdapterUrl });

describe("Messages", () => {
  const channelId = "bb7edb32-2eac-4aad-aebe-ed96fe073879";
  const topic = "bb7edb32-2eac-4aad-aebe-ed96fe073879";
  const message: SenMLMessage = {
    channel: "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
    publisher: "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
    protocol: "http",
    name: "voltage",
    unit: "V",
    time: 1276020076.001,
    value: 120.1,
  };
  const msg = '[{"n": "temp","bu": "C","u": "C","v": 23000}]';
  const secret = "bb7edb32-2eac-4aad-aebe-ed96fe073879";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYjdlZGIzM";
  const domainId = "bb7edb32-2eac-4aad-aebe-ed96fe073879";
  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const messagesPage: MessagesPage = {
    messages: [message],
    total: 2,
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Send should send a message", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ status: 200, message: "Message sent successfully" }),
    );

    const response = await sdk.messages.Send(domainId, topic, msg, secret);
    expect(response).toEqual({
      status: 200,
      message: "Message sent successfully",
    });
  });

  test("Read should read messages", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(messagesPage));

    const response = await sdk.messages.Read(
      domainId,
      channelId,
      queryParams,
      token,
    );
    expect(response).toEqual(messagesPage);
  });
});
