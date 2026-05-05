// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import SDK from "../src/sdk";
import type {
  User,
  UsersPage,
  Login,
  Group,
  GroupsPage,
  Client,
  ClientsPage,
  Channel,
  Token,
  RefreshToken,
} from "../src/sdk";

enableFetchMocks();

const usersUrl = "http://localhost";
const sdk = new SDK({ usersUrl });

describe("Users", () => {
  const user: User = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    first_name: "tahliah",
    last_name: "barnett",
    email: "fkatwigs@email.com",
    tags: ["holy", "terrain"],
    credentials: {
      username: "fkatwigs",
      secret: "12345678",
    },
    role: "admin",
    status: "enabled",
    profile_picture: "https://holyterrain.com",
  };

  const UsersPage: UsersPage = {
    users: [user],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const login: Login = {
    username: "12345678",
    password: "fkatwigs",
  };

  const tokenObject: Token = {
    access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9",
    refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9",
  };

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";
  const refreshToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9";

  const queryParams = {
    offset: 0,
    limit: 10,
  };

  const userId = "886b4266-77d1-4258-abae-2931fb4f16de";
  const domainId = "886b4266-77d1-4258-abae-2931fb4f16de";

  const group: Group = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    domain_id: "886b4266-77d1-4258-abae-2931fb4f16de",
    parent_id: "886b4266-77d1-4258-abae-2931fb4f16de",
    name: "fkatwigs",
    description: "holy terrain",
    level: 1,
    path: "holy terrain",
    status: "enabled",
  };

  const GroupsPage: GroupsPage = {
    groups: [group],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const client: Client = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    name: "fkatwigs",
    domain_id: "886b4266-77d1-4258-abae-2931fb4f16de",
  };

  const clientsPage: ClientsPage = {
    clients: [client],
    total: 1,
    offset: 0,
    limit: 10,
  };

  const channel: Channel = {
    id: "886b4266-77d1-4258-abae-2931fb4f16de",
    name: "fkatwigs",
    domain_id: "886b4266-77d1-4258-abae-2931fb4f16de",
  };

  const channelsPage = {
    channels: [channel],
    total: 1,
    offset: 0,
  };

  const email = "admin@gmail.com";

  const password = "12345678";
  const confPass = "12345678";
  const oldSecret = "12345678";
  const newSecret = "87654321";
  const hostUrl: string = "http://localhost";

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("create should create a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.create(user);
    expect(response).toEqual(user);
  });

  test("createToken should create a token for a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(tokenObject));

    const response = await sdk.Users.createToken(login);
    expect(response).toEqual(tokenObject);
  });

  test("refreshToken should refresh a user's token", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(tokenObject));

    const response = await sdk.Users.refreshToken(refreshToken);
    expect(response).toEqual(tokenObject);
  });

  test("list should get a list of users", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(UsersPage));

    const response = await sdk.Users.list(queryParams, token);
    expect(response).toEqual(UsersPage);
  });

  test("update should update a user metadata", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.update(user, token);
    expect(response).toEqual(user);
  });

  test("updateEmail should update a user email address", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updateEmail(user, token);
    expect(response).toEqual(user);
  });

  test("updateUsername should update a username", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updateUsername(user, token);
    expect(response).toEqual(user);
  });

  test("updateProfilePicture should update a user profile picture URL", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updateProfilePicture(user, token);
    expect(response).toEqual(user);
  });

  test("updatePassword should update a user password", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updatePassword(
      oldSecret,
      newSecret,
      token
    );
    expect(response).toEqual(user);
  });

  test("updateTags should update a user's tags", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updateTags(user, token);
    expect(response).toEqual(user);
  });

  test("updateRole should update a user role", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.updateRole(user, token);
    expect(response).toEqual(user);
  });

  test("get should retrieve a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.get(userId, token);
    expect(response).toEqual(user);
  });

  test("getProfile should return a user profile", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.getProfile(token);
    expect(response).toEqual(user);
  });

  test("disable should disable a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.disable(user.id as string, token);
    expect(response).toEqual(user);
  });

  test("enable should enable a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const response = await sdk.Users.enable(user.id as string, token);
    expect(response).toEqual(user);
  });

  test("listGroups should return a list of groups associated with a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(GroupsPage));

    const response = await sdk.Users.listGroups(
      domainId,
      userId,
      queryParams,
      token
    );
    expect(response).toEqual(GroupsPage);
  });

  test("listClients should return a list of clients associated with a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(clientsPage));

    const response = await sdk.Users.listClients(
      domainId,
      userId,
      queryParams,
      token
    );
    expect(response).toEqual(clientsPage);
  });

  test("listChannels should return a list of channels associated with a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(channelsPage));

    const response = await sdk.Users.listChannels(
      domainId,
      userId,
      queryParams,
      token
    );
    expect(response).toEqual(channelsPage);
  });

  test("resetPasswordRequest should send a password reset request", async () => {
    const resetPasswordRequestResponse = {
      status: 200,
      message: "Email with reset link sent successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(resetPasswordRequestResponse));

    const response = await sdk.Users.resetPasswordRequest(email, hostUrl);
    expect(response).toEqual(resetPasswordRequestResponse);
  });

  test("resetPassword should reset a user password", async () => {
    const resetPasswordResponse = {
      status: 200,
      message: "Password reset successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(resetPasswordResponse));

    const response = await sdk.Users.resetPassword(password, confPass, token);
    expect(response).toEqual(resetPasswordResponse);
  });

  test("delete should delete a user", async () => {
    const deleteResponse = {
      status: 200,
      message: "User deleted successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(deleteResponse));

    const response = await sdk.Users.delete(userId, token);
    expect(response).toEqual(deleteResponse);
  });

  test("search should search for a user", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(UsersPage));

    const response = await sdk.Users.search(queryParams, token);
    expect(response).toEqual(UsersPage);
  });

  test("sendVerification should send a verification email", async () => {
    const sendResponse = {
      status: 200,
      message: "Verification email sent successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(sendResponse));

    const response = await sdk.Users.sendVerification(token);
    expect(response).toEqual(sendResponse);
  });

  test("verifyEmail should verify user's email", async () => {
    const verifyResponse = {
      status: 200,
      message: "Email verified successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(verifyResponse));

    const response = await sdk.Users.verifyEmail(token);
    expect(response).toEqual(verifyResponse);
  });

  test("revokeRefreshToken should revoke a specific refresh token", async () => {
    const revokeResponse = {
      status: 200,
      message: "Refresh token revoked successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(revokeResponse));

    const response = await sdk.Users.revokeRefreshToken(
      "token_RYYW2unQ5K18jYgjRmb3lMFB",
      token
    );
    expect(response).toEqual(revokeResponse);
  });

  test("listActiveRefreshTokens should return all active refresh tokens", async () => {
    const refreshTokens: RefreshToken[] = [
      { id: "token_RYYW2unQ5K18jYgjRmb3lMFB", description: "my laptop" },
      { id: "token_XZab3cdQ7M20kLhjSno4pNGC", description: "mobile app" },
    ];
    fetchMock.mockResponseOnce(
      JSON.stringify({ refresh_tokens: refreshTokens })
    );

    const response = await sdk.Users.listActiveRefreshTokens(token);
    expect(response).toEqual(refreshTokens);
  });
});
