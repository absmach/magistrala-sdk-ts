// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK, { type Journal, type JournalsPage } from "../src/sdk";

enableFetchMocks();

const journalUrl = "http://localhost";
const sdk = new SDK({ journalUrl });

describe("Journal", () => {
  const userJournal: Journal = {
    operation: "user.view",
    occurred_at: "2024-07-03T11:55:31.372177Z",
  };

  const userJournalsPage: JournalsPage = {
    total: 1,
    offset: 0,
    limit: 10,
    journals: [userJournal],
  };

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const userId = "895b0543-50ab-46da-9f23-450cfdb2c12f";

  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const clientTelemetry = {
    client_id: "ce838355-7f80-46cf-ba5c-5fb5d5b891bc",
    domain_id: "e61d04fc-50ce-45e9-b461-8913f4c0cfbe",
    subscriptions: 0,
    inbound_messages: 0,
    outbound_messages: 0,
    first_seen: "2025-02-10T12:01:54.253192Z",
    last_seen: "2025-02-10T12:01:54.253192Z"
  };

  const clientId = "ce838355-7f80-46cf-ba5c-5fb5d5b891bc";

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("listByEntity", () => {
    const entities = [
      {
        entityType: "client",
        entityId: "97cbb344-7c41-47f3-a53a-a3d435b67207",
        domainId: "77cbb344-7c41-47f3-a53a-a3d435b67207",
        expectedResponse: {
          total: 1,
          offset: 0,
          limit: 10,
          journals: [
            {
              operation: "client.view",
              occurred_at: "2024-07-03T11:55:31.372177Z",
            },
          ],
        },
      },
      {
        entityType: "channel",
        entityId: "78cbb344-7c41-47f3-a53a-a3d435br7208",
        domainId: "77cbb344-7c41-47f3-a53a-a3d435b67207",
        expectedResponse: {
          total: 1,
          offset: 0,
          limit: 10,
          journals: [
            {
              operation: "channel.view",
              occurred_at: "2024-07-03T11:55:31.372177Z",
            },
          ],
        },
      },
      {
        entityType: "group",
        entityId: "10cbb344-7c41-47f3-a53a-a3d435b97207",
        domainId: "77cbb344-7c41-47f3-a53a-a3d435b67207",
        expectedResponse: {
          total: 1,
          offset: 0,
          limit: 10,
          journals: [
            {
              operation: "group.view",
              occurred_at: "2024-07-03T11:55:31.372177Z",
            },
          ],
        },
      },
    ];

    test.each(entities)(
      "listByEntity should return a list of entity journals for entityType",
      async ({ entityType, entityId, domainId, expectedResponse }) => {
        fetchMock.mockResponseOnce(JSON.stringify(expectedResponse));
        const response = await sdk.Journal.listByEntity(
          entityType,
          entityId,
          domainId,
          queryParams,
          token
        );
        expect(response).toEqual(expectedResponse);
      }
    );
  });

  test("listByUser should return a list of user journals", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(userJournalsPage));

    const response = await sdk.Journal.listByUser(
      userId,
      queryParams,
      token,
    );
    expect(response).toEqual(userJournalsPage);
  });

  test("clientTelemetry should return client telemetry", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(clientTelemetry));
    const domainId = "e61d04fc-50ce-45e9-b461-8913f4c0cfbe";
    const response = await sdk.Journal.clientTelemetry(
      clientId,
      domainId,
      token,
    );
    expect(response).toEqual(clientTelemetry);
  });
});
