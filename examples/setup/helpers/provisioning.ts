// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-param-reassign, no-restricted-syntax */

import type {
  Channel,
  Domain,
  Group,
} from "../../../src/sdk";
import type { SetupConfig } from "../config";
import type {
  DomainResources,
  SetupState,
  StoredClient,
  UserResources,
} from "../state";
import { saveState } from "../state";
import {
  type CoreOptions,
  type ScenarioContext,
  domainRouteFor,
  isTransportFailure,
  page,
  prefixFor,
  requireDomainId,
  requireId,
  requireToken,
  runStep,
  shouldAdoptExisting,
  sleep,
  stateSuffix,
  toStoredClient,
  tryStep,
} from "./common";

const namePool = [
  ["John", "Doe"],
  ["Jane", "Stone"],
  ["Maya", "Cole"],
  ["Noah", "Reed"],
  ["Ava", "Lane"],
  ["Leo", "Grant"],
];

const stableNumber = (value: string): number => value
  .split("")
  .reduce((total, char) => total + char.charCodeAt(0), 0);

const digitsOnly = (value: string): string => value.replace(/[^a-z0-9]/gi, "").toLowerCase();

const createGeneratedUserIdentity = (
  config: SetupConfig,
  state: SetupState,
  suffix: "primary" | "secondary"
) => {
  const nameIndex = stableNumber(`${config.runId}-${suffix}`) % namePool.length;
  const [firstName, lastName] = namePool[nameIndex];
  const uniquePart = digitsOnly(`${config.runId}${stateSuffix(state)}${suffix}`).slice(-18);
  const username = `${firstName[0]}${lastName}${uniquePart}`.toLowerCase();

  return {
    firstName,
    lastName,
    username,
    email: `${username}@example.com`,
    password: `Mg${uniquePart}${suffix}Secret1`,
  };
};

const refreshUserResources = async (
  context: ScenarioContext,
  label: "user" | "secondaryUser",
  resources: UserResources
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  try {
    const token = await runStep(logger, `${label}.token.refresh`, () => sdk.Users.refreshToken(resources.token.refresh_token));
    resources.token = token;
  } catch (error) {
    logger.error(`${label}.token.refresh`, error);
    const token = await runStep(logger, `${label}.token.issue`, () => sdk.Users.createToken({
      username: resources.credentials.username,
      password: resources.credentials.password,
    }));
    resources.token = token;
  }

  saveState(config, state);
};

const createUserResources = async (
  context: ScenarioContext,
  label: "user" | "secondaryUser"
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  const existing = label === "user" ? state.user : state.secondaryUser;
  if (existing) {
    logger.skipped(label, "already present in run state; refreshing token");
    await refreshUserResources(context, label, existing);
    return;
  }

  const suffix = label === "user" ? "primary" : "secondary";
  const identity = createGeneratedUserIdentity(config, state, suffix);
  const user = await runStep(logger, `${label}.create`, () => sdk.Users.create({
    first_name: identity.firstName,
    last_name: identity.lastName,
    email: identity.email,
    credentials: {
      username: identity.username,
      secret: identity.password,
    },
    metadata: {
      run_id: config.runId,
      source: "examples/setup",
    },
  }));
  const token = await runStep(logger, `${label}.token`, () => sdk.Users.createToken({
    username: identity.username,
    password: identity.password,
  }));
  const resources = {
    data: user,
    credentials: {
      username: identity.username,
      password: identity.password,
      email: identity.email,
    },
    token,
  };

  if (label === "user") {
    state.user = resources;
  } else {
    state.secondaryUser = resources;
  }
  saveState(config, state);
};

export const ensureUserAndToken = async (
  context: ScenarioContext
): Promise<void> => createUserResources(context, "user");

export const ensureSecondaryUserAndToken = async (
  context: ScenarioContext
): Promise<void> => createUserResources(context, "secondaryUser");

const emptyDomainResources = (domain: Domain): DomainResources => ({
  data: domain,
  groups: [],
  clients: [],
  channels: [],
  connections: [],
  messages: [],
  reportConfigs: [],
  reports: [],
});

const findDomainByName = async (
  context: ScenarioContext,
  name: string
): Promise<Domain | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domains = await tryStep(logger, `domain.${name}.lookup`, () => sdk.Domains.list({
    ...page,
    name,
  }, token));
  return (domains?.domains ?? []).find((domain) => domain.name === name || domain.route === name);
};

const findGroupByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<Group | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const groups = await tryStep(logger, `group.${name}.lookup`, () => sdk.Groups.list({
    ...page,
    name,
  }, domainId, token));
  return (groups?.groups ?? []).find((group) => group.name === name);
};

const findClientByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<StoredClient | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const clients = await tryStep(logger, `client.${name}.lookup`, () => sdk.Clients.list({
    ...page,
    name,
  }, domainId, token));
  const client = (clients?.clients ?? []).find((item) => item.name === name);
  if (!client) {
    return undefined;
  }

  return toStoredClient(client);
};

const findChannelByName = async (
  context: ScenarioContext,
  domainId: string,
  name: string
): Promise<Channel | undefined> => {
  const { sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const channels = await tryStep(logger, `channel.${name}.lookup`, () => sdk.Channels.list({
    ...page,
    name,
  }, domainId, token));
  return (channels?.channels ?? []).find((channel) => channel.name === name);
};

export const createDomain = async (
  context: ScenarioContext,
  index: number
): Promise<DomainResources> => {
  const { config, sdk, state, logger } = context;
  const prefix = prefixFor(config, state);
  const token = requireToken(state).access_token;
  const name = `${prefix}-domain-${index + 1}`;
  const route = domainRouteFor(config, state, index);
  if (shouldAdoptExisting()) {
    const existing = await findDomainByName(context, name);
    if (existing) {
      logger.resource(`domain.${index}.adopt`, existing);
      const resources = emptyDomainResources(existing);
      state.domains.push(resources);
      saveState(config, state);
      return resources;
    }
  }

  const domain = await runStep(logger, `domain.${index}.create`, () => sdk.Domains.create(
    {
      name,
      route,
      tags: ["setup", config.runId],
      metadata: {
        run_id: config.runId,
        source: "examples/setup",
      },
    },
    token
  ));
  const resources = emptyDomainResources(domain);
  state.domains.push(resources);
  saveState(config, state);
  return resources;
};

export const createGroup = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<Group> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-group-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findGroupByName(context, domainId, name);
    if (existing) {
      logger.resource(`group.${index}.adopt`, existing);
      domain.groups.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const group = await runStep(logger, `group.${index}.create`, () => sdk.Groups.create(
      {
        name,
        description: `Setup group ${index + 1}`,
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    domain.groups.push(group);
    saveState(config, state);
    return group;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`group.${index}.create`, error);
    await sleep(1000);
    const recovered = await findGroupByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`group.${index}.recover`, recovered);
    domain.groups.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const createClient = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<StoredClient> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-client-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findClientByName(context, domainId, name);
    if (existing) {
      logger.resource(`client.${index}.adopt`, existing);
      domain.clients.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const client = await runStep(logger, `client.${index}.create`, () => sdk.Clients.create(
      {
        name,
        tags: ["setup", config.runId],
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    const storedClient = toStoredClient(client);
    domain.clients.push(storedClient);
    saveState(config, state);
    return storedClient;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`client.${index}.create`, error);
    await sleep(1000);
    const recovered = await findClientByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`client.${index}.recover`, recovered);
    domain.clients.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const createChannel = async (
  context: ScenarioContext,
  domain: DomainResources,
  index: number
): Promise<Channel> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const name = `${prefixFor(config, state)}-channel-${index + 1}`;
  if (shouldAdoptExisting()) {
    const existing = await findChannelByName(context, domainId, name);
    if (existing) {
      logger.resource(`channel.${index}.adopt`, existing);
      domain.channels.push(existing);
      saveState(config, state);
      return existing;
    }
  }

  try {
    const channel = await runStep(logger, `channel.${index}.create`, () => sdk.Channels.create(
      {
        name,
        tags: ["setup", config.runId],
        metadata: {
          run_id: config.runId,
        },
      },
      domainId,
      token
    ));
    domain.channels.push(channel);
    saveState(config, state);
    return channel;
  } catch (error) {
    if (!isTransportFailure(error)) {
      throw error;
    }
    logger.error(`channel.${index}.create`, error);
    await sleep(1000);
    const recovered = await findChannelByName(context, domainId, name);
    if (!recovered) {
      throw error;
    }
    logger.resource(`channel.${index}.recover`, recovered);
    domain.channels.push(recovered);
    saveState(config, state);
    return recovered;
  }
};

export const connectClientToChannel = async (
  context: ScenarioContext,
  domain: DomainResources,
  client: StoredClient,
  channel: Channel,
  group?: Group
): Promise<void> => {
  const { config, sdk, state, logger } = context;
  const token = requireToken(state).access_token;
  const domainId = requireDomainId(domain);
  const clientId = requireId(client.data, "client");
  const channelId = requireId(channel, "channel");
  const groupId = group?.id;
  const existing = domain.connections.some(
    (connection) => connection.clientId === clientId && connection.channelId === channelId
  );
  if (existing) {
    logger.skipped(`connection.${clientId}.${channelId}`, "already present in run state");
    return;
  }

  if (groupId) {
    await runStep(logger, `client.${clientId}.setParentGroup`, () => sdk.Clients.setParentGroup(domainId, clientId, groupId, token));
    await runStep(logger, `channel.${channelId}.setParentGroup`, () => sdk.Channels.setParentGroup(domainId, channelId, groupId, token));
  }

  await runStep(logger, `channel.${channelId}.connectClient`, () => sdk.Channels.connectClient(
    [clientId],
    channelId,
    ["publish", "subscribe"],
    domainId,
    token
  ));
  domain.connections.push({
    clientId,
    channelId,
    groupId,
    types: ["publish", "subscribe"],
  });
  saveState(config, state);
};

export const ensureCore = async (
  context: ScenarioContext,
  options: CoreOptions
): Promise<void> => {
  const { config, state, logger } = context;
  logger.section("Core setup");
  await ensureUserAndToken(context);

  while (state.domains.length < options.domainCount) {
    await createDomain(context, state.domains.length);
  }

  for (const domain of state.domains.slice(0, options.domainCount)) {
    const domainId = requireDomainId(domain);
    logger.section(`Domain ${domainId}`);
    while (domain.groups.length < options.perDomainCount) {
      await createGroup(context, domain, domain.groups.length);
    }
    while (domain.clients.length < options.perDomainCount) {
      await createClient(context, domain, domain.clients.length);
    }
    while (domain.channels.length < options.perDomainCount) {
      await createChannel(context, domain, domain.channels.length);
    }

    for (let index = 0; index < options.perDomainCount; index += 1) {
      await connectClientToChannel(
        context,
        domain,
        domain.clients[index],
        domain.channels[index],
        domain.groups[index]
      );
    }
  }

  logger.resource("core.state.saved", {
    run_id: config.runId,
    domains: state.domains.length,
  });
};
