// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { createScenarioContext, finishScenario } from "./context";
import {
  ensureCore,
  page,
  prefixFor,
  requireChannel,
  requireClient,
  requireDomain,
  requireDomainId,
  requireId,
  requireToken,
  tryStep,
} from "./helpers";

const main = async (): Promise<void> => {
  const context = createScenarioContext("Bootstrap scenario");
  const {
    config,
    logger,
    sdk,
    state,
  } = context;

  await ensureCore(context, { domainCount: 1, perDomainCount: 1 });

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const channel = requireChannel(domain);
  const clientId = requireId(client.data, "client");
  const channelId = requireId(channel, "channel");
  const externalId = `${prefixFor(config, state)}-external`;
  const externalKey = `${prefixFor(config, state)}-external-key`;
  const configId = clientId;

  await tryStep(logger, "bootstrap.add", () => sdk.Bootstrap.add(
    {
      id: configId,
      external_id: externalId,
      external_key: externalKey,
      name: `${prefixFor(config, state)}-bootstrap`,
    },
    domainId,
    token
  ));
  state.bootstrapConfigs.push({
    id: configId,
    external_id: externalId,
    external_key: externalKey,
  });
  await tryStep(logger, "bootstrap.get", () => sdk.Bootstrap.get(configId, domainId, token));
  await tryStep(logger, "bootstrap.list", () => sdk.Bootstrap.list(page, domainId, token));
  await tryStep(logger, "bootstrap.update", () => sdk.Bootstrap.update(
    { id: configId, name: `${prefixFor(config, state)}-bootstrap-updated` },
    domainId,
    token
  ));
  await tryStep(logger, "bootstrap.disable", () => sdk.Bootstrap.updateStatus(configId, "disabled", domainId, token));
  await tryStep(logger, "bootstrap.enable", () => sdk.Bootstrap.updateStatus(configId, "enabled", domainId, token));
  await tryStep(logger, "bootstrap.getByExternalId", () => sdk.Bootstrap.getByExternalId(externalId, externalKey));

  const certs = {
    client_cert: process.env.MG_BOOTSTRAP_CLIENT_CERT,
    client_key: process.env.MG_BOOTSTRAP_CLIENT_KEY,
    ca_cert: process.env.MG_BOOTSTRAP_CA_CERT,
  };
  if (certs.client_cert && certs.client_key && certs.ca_cert) {
    await tryStep(logger, "bootstrap.updateCerts", () => sdk.Bootstrap.updateCerts(
      {
        id: configId,
        client_cert: certs.client_cert,
        client_key: certs.client_key,
        ca_cert: certs.ca_cert,
      },
      domainId,
      token
    ));
  } else {
    logger.skipped("bootstrap.updateCerts", "set MG_BOOTSTRAP_CLIENT_CERT, MG_BOOTSTRAP_CLIENT_KEY, and MG_BOOTSTRAP_CA_CERT");
  }

  const profile = await tryStep(logger, "bootstrap.createProfile", () => sdk.Bootstrap.createProfile(
    {
      name: `${prefixFor(config, state)}-profile`,
      description: "Created by examples/setup",
      content_format: "json",
      content_template:
          "{\"client\":\"{{ .client.id }}\",\"channel\":\"{{ .channel.id }}\"}",
      defaults: {
        run_id: config.runId,
      },
      binding_slots: [
        { name: "client", type: "client", required: true, fields: ["id"] },
        { name: "channel", type: "channel", required: true, fields: ["id"] },
      ],
    },
    domainId,
    token
  ));
  if (profile) {
    state.bootstrapProfiles.push(profile);
  }
  await tryStep(logger, "bootstrap.uploadProfile", () => sdk.Bootstrap.uploadProfile(
    JSON.stringify({
      name: `${prefixFor(config, state)}-uploaded-profile`,
      content_format: "json",
      content_template: "{\"run_id\":\"{{ .run_id }}\"}",
      defaults: { run_id: config.runId },
    }),
    "application/json",
    domainId,
    token
  ));
  if (profile?.id) {
    await tryStep(logger, "bootstrap.viewProfile", () => sdk.Bootstrap.viewProfile(profile.id as string, domainId, token));
    await tryStep(logger, "bootstrap.updateProfile", () => sdk.Bootstrap.updateProfile(
      { id: profile.id, description: "Updated by examples/setup" },
      domainId,
      token
    ));
    await tryStep(logger, "bootstrap.profileSlots", () => sdk.Bootstrap.profileSlots(profile.id as string, domainId, token));
    await tryStep(logger, "bootstrap.renderPreview", () => sdk.Bootstrap.renderPreview(
      profile.id as string,
      {
        render_context: {
          run_id: config.runId,
          client: { id: clientId },
          channel: { id: channelId },
        },
      },
      domainId,
      token
    ));
    await tryStep(logger, "bootstrap.assignProfile", () => sdk.Bootstrap.assignProfile(configId, profile.id as string, domainId, token));
  }
  await tryStep(logger, "bootstrap.bindResources", () => sdk.Bootstrap.bindResources(
    configId,
    [
      { slot: "client", type: "client", resource_id: clientId },
      { slot: "channel", type: "channel", resource_id: channelId },
    ],
    domainId,
    token
  ));
  await tryStep(logger, "bootstrap.listBindings", () => sdk.Bootstrap.listBindings(configId, domainId, token));
  await tryStep(logger, "bootstrap.refreshBindings", () => sdk.Bootstrap.refreshBindings(configId, domainId, token));
  await tryStep(logger, "bootstrap.listProfiles", () => sdk.Bootstrap.listProfiles(page, domainId, token));

  const cryptoKey = process.env.MG_BOOTSTRAP_CRYPTO_KEY;
  if (cryptoKey) {
    await tryStep(logger, "bootstrap.getSecure", () => sdk.Bootstrap.getSecure(externalId, externalKey, cryptoKey));
  } else {
    logger.skipped("bootstrap.getSecure", "set MG_BOOTSTRAP_CRYPTO_KEY");
  }

  if (config.destructive) {
    if (profile?.id) {
      await tryStep(logger, "bootstrap.deleteProfile", () => sdk.Bootstrap.deleteProfile(profile.id as string, domainId, token));
    }
    await tryStep(logger, "bootstrap.delete", () => sdk.Bootstrap.delete(configId, domainId, token));
  } else {
    logger.skipped("bootstrap.delete", "set MG_RUN_DESTRUCTIVE=true");
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
