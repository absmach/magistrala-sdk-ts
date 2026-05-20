// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/prefer-default-export */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import type {
  Alarm,
  BootstrapConfig,
  BootstrapProfile,
  Cert,
  Channel,
  Client,
  Domain,
  Group,
  PAT,
  ReportConfig,
  ReportPage,
  Rule,
  Token,
  User,
} from "../../src/sdk";
import type { SetupConfig } from "./config";

export interface StoredClient {
  data: Client;
  identity?: string;
  secret: string;
}

export interface ConnectionSummary {
  clientId: string;
  channelId: string;
  groupId?: string;
  types: string[];
}

export interface SentMessageSummary {
  channelId: string;
  clientId: string;
  topic: string;
  payload: string;
  names: string[];
  recordCount?: number;
  sampleCount?: number;
}

export interface DomainResources {
  data: Domain;
  groups: Group[];
  clients: StoredClient[];
  channels: Channel[];
  connections: ConnectionSummary[];
  saveRule?: Rule;
  alarmRule?: Rule;
  messages: SentMessageSummary[];
  reportConfigs: ReportConfig[];
  reports: ReportPage[];
}

export interface UserResources {
  data: User;
  credentials: {
    username: string;
    password: string;
    email: string;
  };
  token: Token;
}

export interface SetupState {
  runId: string;
  createdAt: string;
  updatedAt: string;
  user?: UserResources;
  secondaryUser?: UserResources;
  domains: DomainResources[];
  pats: PAT[];
  certs: Cert[];
  bootstrapConfigs: BootstrapConfig[];
  bootstrapProfiles: BootstrapProfile[];
  alarms: Alarm[];
}

const runsDir = join(__dirname, ".runs");

export const statePathFor = (runId: string): string => join(runsDir, `${runId}.json`);

export const createEmptyState = (runId: string): SetupState => {
  const now = new Date().toISOString();
  return {
    runId,
    createdAt: now,
    updatedAt: now,
    domains: [],
    pats: [],
    certs: [],
    bootstrapConfigs: [],
    bootstrapProfiles: [],
    alarms: [],
  };
};

export const loadState = (config: SetupConfig): SetupState => {
  const statePath = statePathFor(config.runId);
  if (!existsSync(statePath)) {
    return createEmptyState(config.runId);
  }

  return JSON.parse(readFileSync(statePath, "utf8")) as SetupState;
};

export const saveState = (
  config: SetupConfig,
  state: SetupState
): SetupState => {
  const nextState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
  const statePath = statePathFor(config.runId);
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`);
  return nextState;
};
