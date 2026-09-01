// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import SDK from "../src/sdk";
import type {
  BootstrapConfig,
  BootstrapPage,
  BootstrapProfile,
  BootstrapProfilesPage,
  BootstrapBindingRequest,
  BootstrapBindingSnapshot,
  RenderPreviewRequest,
  BindingSlot,
  PageMetadata,
} from "../src/sdk";

enableFetchMocks();

const bootstrapUrl = "http://localhost";
const sdk = new SDK({ bootstrapUrl });

describe("Bootstraps", () => {
  const bootstrap: BootstrapConfig = {
    external_id: "012",
    external_key: "aabbcc",
    id: "77cbb344-7c41-47f3-a53a-a3d435b67207",
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
  const deviceId = "77cbb344-7c41-47f3-a53a-a3d435b67207";
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

    const response = await sdk.Bootstrap.add(bootstrap, domainId, token);
    expect(response).toEqual(createResponse);
  });

  test("UpdateStatus should update bootstrap configuration status", async () => {
    const updateStatusResponse = {
      status: 200,
      message: "Bootstrap configuration status updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(updateStatusResponse));

    const response = await sdk.Bootstrap.updateStatus(
      deviceId,
      "enabled",
      domainId,
      token
    );
    expect(response).toEqual(updateStatusResponse);
  });

  test("Update bootstrap should update a bootstrap configuration", async () => {
    const updateResponse = {
      status: 200,
      message: "Bootstrap configuration updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(updateResponse));

    const response = await sdk.Bootstrap.update(bootstrap, domainId, token);
    expect(response).toEqual(updateResponse);
  });

  test("View bootstrap should view a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.get(deviceId, domainId, token);
    expect(response).toEqual(bootstrap);
  });

  test("Update bootstrap certs should update certs of a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.updateCerts(
      bootstrap,
      domainId,
      token
    );
    expect(response).toEqual(bootstrap);
  });

  test("Delete bootstrap should delete a bootstrap configuration", async () => {
    const deleteResponse = {
      status: 200,
      message: "Bootstrap configuration deleted",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteResponse));

    const response = await sdk.Bootstrap.delete(deviceId, domainId, token);
    expect(response).toEqual(deleteResponse);
  });

  test("Bootstrap should retrieve a bootstrap configuration", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrap));

    const response = await sdk.Bootstrap.getByExternalId(
      externalId,
      externalKey
    );
    expect(response).toEqual(bootstrap);
  });

  test("Bootstraps should retrieve all bootstraps", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(bootstrapPage));

    const response = await sdk.Bootstrap.list(queryParams, domainId, token);
    expect(response).toEqual(bootstrapPage);
  });

  test("Create bootstrap profile should create a profile", async () => {
    const profile: BootstrapProfile = {
      id: "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      name: "test-profile",
      description: "A test profile",
      content_format: "json",
      content_template: '{"key": "{{ .value }}"}',
      defaults: { value: "default" },
      binding_slots: [
        { name: "sensor", type: "client", required: true, fields: ["id"] },
      ],
    };
    fetchMock.mockResponseOnce(JSON.stringify(profile));

    const response = await sdk.Bootstrap.createProfile(
      profile,
      domainId,
      token
    );
    expect(response).toEqual(profile);
  });

  test("Upload bootstrap profile should create a profile from file content", async () => {
    const profile: BootstrapProfile = {
      id: "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      name: "uploaded-profile",
    };
    fetchMock.mockResponseOnce(JSON.stringify(profile));

    const content = JSON.stringify({
      name: "uploaded-profile",
      content_format: "json",
      content_template: '{"key": "{{ .value }}"}',
    });
    const response = await sdk.Bootstrap.uploadProfile(
      content,
      "application/json",
      domainId,
      token
    );
    expect(response).toEqual(profile);
  });

  test("View bootstrap profile should return a profile", async () => {
    const profile: BootstrapProfile = {
      id: "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      name: "test-profile",
    };
    fetchMock.mockResponseOnce(JSON.stringify(profile));

    const response = await sdk.Bootstrap.viewProfile(
      "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      domainId,
      token
    );
    expect(response).toEqual(profile);
  });

  test("Update bootstrap profile should update a profile", async () => {
    const updateResponse = {
      status: 200,
      message: "Bootstrap profile updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(updateResponse));

    const response = await sdk.Bootstrap.updateProfile(
      {
        id: "aa1edb32-2eac-4aad-aebe-ed96fe073879",
        name: "updated-profile",
      },
      domainId,
      token
    );
    expect(response).toEqual(updateResponse);
  });

  test("List bootstrap profiles should return a profiles page", async () => {
    const profile: BootstrapProfile = {
      id: "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      name: "test-profile",
    };
    const profilesPage: BootstrapProfilesPage = {
      profiles: [profile],
      total: 1,
      offset: 0,
      limit: 10,
    };
    fetchMock.mockResponseOnce(JSON.stringify(profilesPage));

    const response = await sdk.Bootstrap.listProfiles(
      queryParams,
      domainId,
      token
    );
    expect(response).toEqual(profilesPage);
  });

  test("Delete bootstrap profile should delete a profile", async () => {
    const deleteResponse = {
      status: 200,
      message: "Bootstrap profile deleted",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteResponse));

    const response = await sdk.Bootstrap.deleteProfile(
      "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      domainId,
      token
    );
    expect(response).toEqual(deleteResponse);
  });

  test("Assign bootstrap profile should assign a profile to an enrollment", async () => {
    const assignResponse = {
      status: 200,
      message: "Bootstrap profile assigned successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(assignResponse));

    const response = await sdk.Bootstrap.assignProfile(
      deviceId,
      "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      domainId,
      token
    );
    expect(response).toEqual(assignResponse);
  });

  test("Bind bootstrap resources should store binding snapshots", async () => {
    const bindResponse = {
      status: 200,
      message: "Bootstrap resources bound successfully",
    };
    const bindings: BootstrapBindingRequest[] = [
      { slot: "sensor", type: "client", resource_id: deviceId },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(bindResponse));

    const response = await sdk.Bootstrap.bindResources(
      deviceId,
      bindings,
      domainId,
      token
    );
    expect(response).toEqual(bindResponse);
  });

  test("List bootstrap bindings should return binding snapshots", async () => {
    const snapshots: BootstrapBindingSnapshot[] = [
      {
        config_id: deviceId,
        slot: "sensor",
        type: "client",
        resource_id: "cc2fdb32-2eac-4aad-aebe-ed96fe073879",
        snapshot: { id: "cc2fdb32-2eac-4aad-aebe-ed96fe073879" },
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ bindings: snapshots }));

    const response = await sdk.Bootstrap.listBindings(
      deviceId,
      domainId,
      token
    );
    expect(response).toEqual(snapshots);
  });

  test("Refresh bootstrap bindings should refresh binding snapshots", async () => {
    const refreshResponse = {
      status: 200,
      message: "Bootstrap bindings refreshed successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(refreshResponse));

    const response = await sdk.Bootstrap.refreshBindings(
      deviceId,
      domainId,
      token
    );
    expect(response).toEqual(refreshResponse);
  });

  test("Profile slots should return binding slots for a profile", async () => {
    const slots: BindingSlot[] = [
      { name: "sensor", type: "client", required: true, fields: ["id"] },
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ binding_slots: slots }));

    const response = await sdk.Bootstrap.profileSlots(
      "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      domainId,
      token
    );
    expect(response).toEqual(slots);
  });

  test("Render preview should return rendered content string", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ content: '{"key": "example"}' })
    );

    const request: RenderPreviewRequest = {
      config: { id: deviceId },
      render_context: { value: "example" },
    };
    const response = await sdk.Bootstrap.renderPreview(
      "aa1edb32-2eac-4aad-aebe-ed96fe073879",
      request,
      domainId,
      token
    );
    expect(response).toEqual('{"key": "example"}');
  });

  test("UpdateStatus should throw on invalid status value", async () => {
    await expect(
      sdk.Bootstrap.updateStatus(deviceId, "invalid" as any, domainId, token)
    ).rejects.toThrow("Invalid bootstrap status 'invalid'");
  });

  test("Update should throw when id is missing", async () => {
    await expect(
      sdk.Bootstrap.update({ name: "test" }, domainId, token)
    ).rejects.toThrow("Bootstrap config id is required for update");
  });

  test("UpdateCerts should throw when id is missing", async () => {
    await expect(
      sdk.Bootstrap.updateCerts({ device_cert: "cert" }, domainId, token)
    ).rejects.toThrow("Bootstrap config id is required for updateCerts");
  });

  test("UpdateProfile should throw when id is missing", async () => {
    await expect(
      sdk.Bootstrap.updateProfile({ name: "profile" }, domainId, token)
    ).rejects.toThrow("Bootstrap profile id is required for update");
  });

  test("UploadProfile should throw on unsupported content type", async () => {
    await expect(
      sdk.Bootstrap.uploadProfile("content", "text/plain", domainId, token)
    ).rejects.toThrow("Unsupported content type 'text/plain'");
  });

  test("Bind bootstrap resources should fall back to the status text when the error response has no body", async () => {
    fetchMock.mockResponseOnce("", {
      status: 500,
      statusText: "Internal Server Error",
    });
    const bindings: BootstrapBindingRequest[] = [
      { slot: "sensor", type: "device", resource_id: deviceId },
    ];

    await expect(
      sdk.Bootstrap.bindResources(deviceId, bindings, domainId, token)
    ).rejects.toEqual({
      status: 500,
      error: "Internal Server Error",
    });
  });

  test("Bind bootstrap resources should surface the server's message when the error response has a JSON body", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "not found" }), {
      status: 404,
    });
    const bindings: BootstrapBindingRequest[] = [
      { slot: "sensor", type: "device", resource_id: deviceId },
    ];

    await expect(
      sdk.Bootstrap.bindResources(deviceId, bindings, domainId, token)
    ).rejects.toEqual({
      status: 404,
      error: "not found",
    });
  });
});
