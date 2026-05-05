// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import { PAT, PATsPage, Scope, ScopesPage } from "../src/defs";

enableFetchMocks();

const authUrl = "http://localhost";
const sdk = new SDK({ authUrl });

describe("PATs", () => {
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const scope: Scope = {
    id: "523e8d81-dca8-49ed-b836-e61988fa898c",
    pat_id: "6f5c5847-9331-4c34-b037-f51bf0abd4d6",
    domain_id: "8ef3ee89-1923-4d5b-97eb-ff3c5d211a6b",
    entity_id: "*",
    operation: "read"
  };
  const scopes = [scope];
  const pat: PAT = {
    id: "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1",
    user: "6a422a33-f849-4631-aa8f-92132037c84a",
    name: "PAT",
    description: "description",
    secret: "pat_akIqM/hJRjGqj5ITIDfISqWksaHqiUftry5bOOaW1qE=_5R2m-++-L4wsbl&cFiKai8|NI%!Lys6|eLOzMTAqkaB90@6MwAXEYPIgLxRyIhpLj#zrSCTYzvd&ISejfncarjwn!|u0*NV-JJnb",
    scope: scopes,
  };
  const name = "pat1";
  const duration = "24hrs";
  const patId = "a5a4b1a1-ea89-47ed-af2e-5b38e696d6a1";
  const scopeIds = ["523e8d81-dca8-49ed-b836-e61988fa898c"];
  const description = "description";
  const patsPage: PATsPage = {
    pats: [pat],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const scopesPage: ScopesPage = {
    scopes: [scope],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const queryParams = {
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Create should create a PAT", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(pat));

    const response = await sdk.PATs.create(name, duration, token);
    expect(response).toEqual(pat);
  });

  test("list should return a list of PATs", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(patsPage));

    const response = await sdk.PATs.list(queryParams, token);
    expect(response).toEqual(patsPage);
  });

  test("get should return a PAT", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(pat));

    const response = await sdk.PATs.get(patId, token);
    expect(response).toEqual(pat);
  });

  test("deleteAll should delete all PATs", async () => {
    const successResponse = {
      status: 200,
      message: "PATs deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.deleteAll(token);
    expect(response).toEqual(successResponse);
  });

  test("UpdateName should update PAT name", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(name));

    const response = await sdk.PATs.updateName(name, patId, token);
    expect(response).toEqual(name);
  });

  test("UpdateDescription should update PAT description", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(description));

    const response = await sdk.PATs.updateDescription(description, patId, token);
    expect(response).toEqual(description);
  });

  test("delete should delete a PAT", async () => {
    const successResponse = {
      status: 200,
      message: "PAT deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.delete(patId, token);
    expect(response).toEqual(successResponse);
  });

  test("ResetSecret should reset PAT secret", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(pat));

    const response = await sdk.PATs.resetSecret(duration, patId, token);
    expect(response).toEqual(pat);
  });

  test("revoke should revoke a PAT", async () => {
    const successResponse = {
      status: 200,
      message: "PAT revoked successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.revoke(patId, token);
    expect(response).toEqual(successResponse);
  });

  test("AddScope should add scopes to a PAT", async () => {
    const successResponse = {
      status: 200,
      message: "Scope added successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.addScope(scopes, patId, token);
    expect(response).toEqual(successResponse);
  });

  test("ListScopes should return a list of scopes", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(scopesPage));

    const response = await sdk.PATs.listScopes(patId, queryParams, token);
    expect(response).toEqual(scopesPage);
  });

  test("DeleteScopes should remove a scope from a PAT", async () => {
    const successResponse = {
      status: 200,
      message: "Scopes removed successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.deleteScopes(patId, scopeIds, token);
    expect(response).toEqual(successResponse);
  });

  test("DeleteAllScopes should delete all scope from a PAT", async () => {
    const successResponse = {
      status: 200,
      message: "All scopes deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const response = await sdk.PATs.deleteAllScopes(patId, token);
    expect(response).toEqual(successResponse);
  });
});
