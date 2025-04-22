// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK, { Rule, RulesPage, Schedule } from "../src/sdk";

enableFetchMocks();

const authUrl = "http://localhost";
const sdk = new SDK({ authUrl });

describe("Rules SDK", () => {
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const domainId = "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1";
  const queryParams = {
    offset: 0,
    limit: 10,
  };
  const rule: Rule = {
    id: "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1",
    name: "rule 1",
    schedule: {
      start_datetime: "2025-02-07T03:14:00.000Z",
      time: "0001-01-01T07:39:44.000Z",
      recurring: "none",
      recurring_period: 0,
    },
    logic: {
      kind: "save_senml",
      type: 0,
      value: "this is the logic",
    },
    metadata: {
      key: "value",
    },
  };

  const rulesPage: RulesPage = {
    rules: [rule],
    total: 1,
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Create should create a rule", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.create(domainId, rule, token);
    expect(response).toEqual(rule);
  });

  test("List should return a list of rules", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rulesPage));

    const response = await sdk.Rules.list(domainId, queryParams, token);
    expect(response).toEqual(rulesPage);
  });

  test("View should return a rule", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.view(domainId, rule.id as string, token);
    expect(response).toEqual(rule);
  });

  test("Update should update a rule", async () => {
    const updatedRule: Rule = {
      ...rule,
      name: "updated rule",
    };

    fetchMock.mockResponseOnce(JSON.stringify(updatedRule));

    const response = await sdk.Rules.update(domainId, updatedRule, token);
    expect(response).toEqual(updatedRule);
  });

  test("Update schedule should update the schedule", async () => {
    const updatedSchedule: Schedule = {
      start_datetime: "2025-02-07T03:14:00.000Z",
      time: "0001-01-01T07:39:44.000Z",
      recurring: "none",
      recurring_period: 0,
    };
    rule.schedule = updatedSchedule;
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.updateSchedule(
      domainId,
      rule.id as string,
      updatedSchedule,
      token
    );
    expect(response).toEqual(rule);
  });

  test("Delete should delete a rule", async () => {
    const successResponse = {
      status: 200,
      message: "Rule deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.Rules.delete(domainId, rule.id as string, token);
    expect(response).toEqual(successResponse);
  });

  test("Enable should enable a rule", async () => {
    rule.status = "enabled";
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.enable(domainId, rule.id as string, token);
    expect(response).toEqual(rule);
  });

  test("Disable should disable a rule", async () => {
    rule.status = "disabled";
    fetchMock.mockResponseOnce(JSON.stringify(rule));

    const response = await sdk.Rules.disable(
      domainId,
      rule.id as string,
      token
    );
    expect(response).toEqual(rule);
  });
});
