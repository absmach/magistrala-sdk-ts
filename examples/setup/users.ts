// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  ensureSecondaryUserAndToken,
  page,
  requireDomain,
  requireDomainId,
  requireToken,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Users scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureCore(context, { domainCount: 1, perDomainCount: 1 });
  await ensureSecondaryUserAndToken(context);

  const token = requireToken(state).access_token;
  const refreshToken = requireToken(state).refresh_token;
  const user = state.user?.data;
  const secondary = state.secondaryUser;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);

  if (!user?.id || !secondary?.data.id) {
    throw new Error("Users scenario requires primary and secondary user ids");
  }

  await tryStep(logger, "users.get", () => sdk.Users.get(user.id as string, token));
  await tryStep(logger, "users.profile", () => sdk.Users.getProfile(token));
  await tryStep(logger, "users.refreshToken", () => sdk.Users.refreshToken(refreshToken));
  await tryStep(logger, "users.list", () => sdk.Users.list(page, token));
  await tryStep(logger, "users.search", () => sdk.Users.search({ username: state.user?.credentials.username }, token));
  await tryStep(logger, "users.update", () => sdk.Users.update(
    {
      id: user.id,
      first_name: "Setup Updated",
      last_name: "Primary",
      metadata: { run_id: config.runId },
    },
    token
  ));
  await tryStep(logger, "users.updateTags", () => sdk.Users.updateTags({ id: user.id, tags: ["setup", config.runId] }, token));
  await tryStep(logger, "users.updateProfilePicture", () => sdk.Users.updateProfilePicture(
    {
      id: user.id,
      profile_picture: "https://example.com/setup-profile.png",
    },
    token
  ));
  await tryStep(logger, "users.disable.secondary", () => sdk.Users.disable(secondary.data.id as string, token));
  await tryStep(logger, "users.enable.secondary", () => sdk.Users.enable(secondary.data.id as string, token));
  await tryStep(logger, "users.listGroups", () => sdk.Users.listGroups(domainId, user.id as string, page, token));
  await tryStep(logger, "users.listClients", () => sdk.Users.listClients(domainId, user.id as string, page, token));
  await tryStep(logger, "users.listChannels", () => sdk.Users.listChannels(domainId, user.id as string, page, token));
  await tryStep(logger, "users.activeRefreshTokens", () => sdk.Users.listActiveRefreshTokens(token));

  const hostUrl = process.env.MG_RESET_HOST_URL;
  if (hostUrl) {
    await tryStep(logger, "users.resetPasswordRequest", () => sdk.Users.resetPasswordRequest(secondary.credentials.email, hostUrl));
  } else {
    logger.skipped("users.resetPasswordRequest", "set MG_RESET_HOST_URL");
  }

  const resetToken = process.env.MG_RESET_TOKEN;
  if (resetToken) {
    await tryStep(logger, "users.resetPassword", () => sdk.Users.resetPassword("new-secret", "new-secret", resetToken));
  } else {
    logger.skipped("users.resetPassword", "set MG_RESET_TOKEN");
  }

  const verificationToken = process.env.MG_VERIFICATION_TOKEN;
  if (verificationToken) {
    await tryStep(logger, "users.verifyEmail", () => sdk.Users.verifyEmail(verificationToken));
  } else {
    logger.skipped("users.verifyEmail", "set MG_VERIFICATION_TOKEN");
  }
  await tryStep(logger, "users.sendVerification", () => sdk.Users.sendVerification(token));

  if (config.destructive) {
    await tryStep(logger, "users.delete.secondary", () => sdk.Users.delete(secondary.data.id as string, token));
  } else {
    logger.skipped("users.delete.secondary", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
