// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import Alarms from "../src/alarms";
import {
  type Alarm,
  type AlarmsPage,
  type Response,
} from "../src/defs";

enableFetchMocks();

const alarmsUrl = "http://localhost";
const sdk = new Alarms({ alarmsUrl });

const alarm: Alarm = {
  id: "12345",
  rule_id: "rule123",
  cause: "High temperature alert",
  status: "active",
};

const alarms: Alarm[] = [
  {
    id: "12345",
    rule_id: "rule123",
    cause: "High temperature alert",
    status: "active",
  },
  {
    id: "12346",
    rule_id: "rule124",
    cause: "Low temperature alert",
    status: "cleared",
  },
];

const queryParams = {
  offset: 0,
  limit: 10,
};

const alarmsPage: AlarmsPage = {
  alarms,
  total: 2,
  offset: 0,
  limit: 10,
};

const alarmId = "12345";
const domainId = "domain123";
const token = "valid token";
const successResponse: Response = {
  status: 200,
  message: "Alarm deleted successfully",
};

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("Alarms", () => {
  test("List should get a list of alarms", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(alarmsPage));

    const response = await sdk.list(domainId, queryParams, token);
    expect(response).toEqual(alarmsPage);
  });

  test("View should retrieve an alarm", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(alarm));

    const response = await sdk.view(domainId, alarmId, token);
    expect(response).toEqual(alarm);
  });

  test("Update should partially update an alarm", async () => {
    const updatedAlarm = {
      ...alarm,
      status: "cleared" as const,
    };
    fetchMock.mockResponseOnce(JSON.stringify(updatedAlarm));

    const response = await sdk.update(
      domainId,
      alarmId,
      { status: "cleared" },
      token
    );
    expect(response).toEqual(updatedAlarm);

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(request.method).toBe("PATCH");
    expect(JSON.parse(request.body as string)).toEqual({ status: "cleared" });
  });

  test("Delete should delete an alarm", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.delete(domainId, alarmId, token);
    expect(response).toEqual(successResponse);
  });
});
