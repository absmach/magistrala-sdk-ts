// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-param-reassign */

import SDK, {
  type Channel,
  type Client,
  type Group,
  type Token,
} from "../../../src/sdk";
import type { SetupConfig } from "../config";
import type { SetupLogger } from "../logger";
import type {
  DomainResources,
  SetupState,
  StoredClient,
} from "../state";

export interface CoreOptions {
  domainCount: number;
  perDomainCount: number;
}

export interface ScenarioContext {
  config: SetupConfig;
  sdk: SDK;
  state: SetupState;
  logger: SetupLogger;
}

export const page = { offset: 0, limit: 10 };

export const sampleMessageNames = ["temperature", "voltage"];

export const messageSampleCount = 50;
const maxDomainRouteLength = 36;

const safe = (value: string): string => value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

const safeRoute = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const stateSuffix = (state: SetupState): string => state.createdAt.replace(/[-:.TZ]/g, "").slice(0, 14);

export const prefixFor = (config: SetupConfig, state: SetupState): string => safe(`setup-${config.runId}-${stateSuffix(state)}`).slice(0, 48);

export const domainRouteFor = (
  config: SetupConfig,
  state: SetupState,
  index: number
): string => {
  const base = "setup";
  const suffix = `${stateSuffix(state)}d${index + 1}`;
  const maxRunLength = Math.max(0, maxDomainRouteLength - base.length - suffix.length);
  return `${base}${safeRoute(config.runId).slice(0, maxRunLength)}${suffix}`;
};

export const shouldAdoptExisting = (): boolean => process.env.MG_SETUP_ADOPT_EXISTING === "true";

export const requireId = (
  resource: { id?: string },
  label: string
): string => {
  if (!resource.id) {
    throw new Error(`${label} response did not include an id`);
  }
  return resource.id;
};

export const requireToken = (state: SetupState): Token => {
  if (!state.user?.token) {
    throw new Error("Run the core setup first; no user token is available");
  }
  return state.user.token;
};

export const requireDomain = (
  state: SetupState,
  index = 0
): DomainResources => {
  const domain = state.domains[index];
  if (!domain) {
    throw new Error("Run the core setup first; no domain is available");
  }
  return domain;
};

export const requireDomainId = (domain: DomainResources): string => requireId(domain.data, "domain");

export const requireGroup = (
  domain: DomainResources,
  index = 0
): Group => {
  const group = domain.groups[index];
  if (!group) {
    throw new Error("Run the core setup first; no group is available");
  }
  return group;
};

export const requireClient = (
  domain: DomainResources,
  index = 0
): StoredClient => {
  const client = domain.clients[index];
  if (!client) {
    throw new Error("Run the core setup first; no client is available");
  }
  return client;
};

export const requireChannel = (
  domain: DomainResources,
  index = 0
): Channel => {
  const channel = domain.channels[index];
  if (!channel) {
    throw new Error("Run the core setup first; no channel is available");
  }
  return channel;
};

export const runStep = async <T>(
  logger: SetupLogger,
  label: string,
  fn: () => Promise<T>
): Promise<T> => {
  logger.info(`- ${label}`);
  const value = await fn();
  logger.resource(label, value);
  return value;
};

export const tryStep = async <T>(
  logger: SetupLogger,
  label: string,
  fn: () => Promise<T>
): Promise<T | undefined> => {
  try {
    return await runStep(logger, label, fn);
  } catch (error) {
    logger.error(label, error);
    return undefined;
  }
};

const isDuplicateEntity = (error: unknown): boolean => (
  typeof error === "object" &&
  error !== null &&
  "error" in error &&
  String((error as { error?: unknown }).error).includes("entity already exists")
);

export const tryDuplicateSafeStep = async <T>(
  logger: SetupLogger,
  label: string,
  fn: () => Promise<T>
): Promise<T | undefined> => {
  try {
    return await runStep(logger, label, fn);
  } catch (error) {
    if (isDuplicateEntity(error)) {
      logger.skipped(label, "entity already exists");
      return undefined;
    }
    logger.error(label, error);
    return undefined;
  }
};

export const sleep = (milliseconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export const isTransportFailure = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const cause = "cause" in error ? error.cause : undefined;
  return error.message === "fetch failed" || (
    cause instanceof Error && cause.message.includes("other side closed")
  );
};

export const toStoredClient = (client: Client): StoredClient => {
  const secret = client.credentials?.secret;
  if (!secret) {
    throw new Error("Client response did not include credentials.secret");
  }
  const identity = client.credentials?.identity ?? client.identity;

  return {
    data: {
      ...client,
      identity,
      credentials: {
        ...client.credentials,
        ...(identity ? { identity } : {}),
        secret,
      },
    },
    identity,
    secret,
  };
};
