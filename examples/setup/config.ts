// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/prefer-default-export */

import SDK, { type SDKConfig } from "../../src/sdk";

export interface SetupConfig {
  runId: string;
  baseUrl: string;
  urls: Required<SDKConfig>;
  destructive: boolean;
}

const env = (name: string, fallback: string): string => process.env[name] ?? fallback;

const stripTrailingSlash = (value: string): string => value.replace(/\/$/, "");

const readRunId = (): string => {
  const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
  return process.env.MG_RUN_ID ?? runIdArg?.replace("--run-id=", "") ?? "local";
};

export const readSetupConfig = (): SetupConfig => {
  const baseUrl = stripTrailingSlash(env("MG_BASE_URL", "http://localhost"));
  const urls: Required<SDKConfig> = {
    authUrl: env("MG_AUTH_URL", `${baseUrl}:9001`),
    usersUrl: env("MG_USERS_URL", `${baseUrl}:9002`),
    domainsUrl: env("MG_DOMAINS_URL", `${baseUrl}:9003`),
    groupsUrl: env("MG_GROUPS_URL", `${baseUrl}:9004`),
    channelsUrl: env("MG_CHANNELS_URL", `${baseUrl}:9005`),
    clientsUrl: env("MG_CLIENTS_URL", `${baseUrl}:9006`),
    rulesUrl: env("MG_RULES_URL", `${baseUrl}:9008`),
    readersUrl: env("MG_READERS_URL", `${baseUrl}:9011`),
    bootstrapUrl: env("MG_BOOTSTRAP_URL", `${baseUrl}:9013`),
    reportsUrl: env("MG_REPORTS_URL", `${baseUrl}:9017`),
    certsUrl: env("MG_CERTS_URL", `${baseUrl}:9019`),
    journalUrl: env("MG_JOURNAL_URL", `${baseUrl}:9021`),
    alarmsUrl: env("MG_ALARMS_URL", `${baseUrl}:8050`),
    httpAdapterUrl: env("MG_HTTP_ADAPTER_URL", `${baseUrl}/http`),
  };

  return {
    runId: readRunId(),
    baseUrl,
    urls,
    destructive: process.env.MG_RUN_DESTRUCTIVE === "true",
  };
};

export const createSdk = (config: SetupConfig): SDK => new SDK(config.urls);
