// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type { BootstrapConfig, BootstrapPage, PageMetadata } from "../src/sdk";

enableFetchMocks();

const bootstrapUrl = "http://localhost";
const sdk = new SDK({ bootstrapUrl });

describe("Bootstraps", () => {
  const bootstrap: BootstrapConfig = {
    external_id: "012",
    external_key: "aabbcc",
    client_id: "77cbb344-7c41-47f3-a53a-a3d435b67207",
    name: "percius",
  };
  const queryParams: PageMetadata = {
    offset: 0,
    limit: 10,
  };
  const bootstrapPage: BootstrapPage = {
    configs: [bootstrap],
    total: 2,
    offset: 0,
    limit: 10,
  };
  const channels = [
    "bb7edb32-2eac-4aad-aebe-ed96fe073879",
    "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  ];
  const clientId = "77cbb344-7c41-47f3-a53a-a3d435b67207";
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const domainId = "886b4266-77d1-4258-abae-2931fb4f16de";
  const externalKey = "key";
  const externalId = "345";

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("Add bootstrap should create a bootstrap configuration", async () => {
    const createResponse = {
      status: 200,
      message: "Bootstrap configuration created",
    };
    fetchMock.mockResponseOnce(JSON.stringify(createResponse));

    const response = await sdk.Bootstrap.add(
      bootstrap,
      domainId,
      token,
    );
    expect(response).toEqual(createResponse);
  });

  test("Whitelist should whitelist a bootstrap configuration", async () => {
    const whitelistResponse = {
      status: 200,
      message: "Bootstrap configuration state updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(whitelistResponse));

    const response = await sdk.Bootstrap.whitelist(bootstrap, domainId, token);
    expect(response).toEqual(whitelistResponse);
  });

  test("Update bootstrap should update a bootstrap configuration", async () => {
    const updateResponse = {
      status: 200,
      message: "Bootstrap configuration updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(updateResponse));

    const response = await sdk.Bootstrap.update(
      bootstrap,
      domainId,
      token,
    );
    expect(response).toEqual(updateResponse);
  });

  test("View bootstrap should view a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.get(
      clientId,
      domainId,
      token,
    );
    expect(response).toEqual(bootstrap);
  });

  test("Update bootstrap certs should update certs of a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.updateCerts(
      bootstrap,
      domainId,
      token,
    );
    expect(response).toEqual(bootstrap);
  });

  test("Delete bootstrap should delete a bootstrap configuration", async () => {
    const deleteResponse = {
      status: 200,
      message: "Bootstrap configuration deleted",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteResponse));

    const response = await sdk.Bootstrap.delete(
      clientId,
      domainId,
      token,
    );
    expect(response).toEqual(deleteResponse);
  });

  test("Bootstrap should retrieve a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.getByExternalId(externalId, externalKey);
    expect(response).toEqual(bootstrap);
  });

  test("Bootstraps should retrieve all bootstraps", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrapPage));

    const response = await sdk.Bootstrap.list(
      queryParams,
      domainId,
      token,
    );
    expect(response).toEqual(bootstrapPage);
  });

  test("Update bootstrap connection update bootstrap connection", async () => {
    const connResponse = {
      status: 200,
      message: "Bootstrap connection successful",
    };
    fetchMock.mockResponseOnce(JSON.stringify(connResponse));

    const response = await sdk.Bootstrap.updateConnection(
      clientId,
      domainId,
      channels,
      token,
    );
    expect(response).toEqual(connResponse);
  });
});
