// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/prefer-default-export */

import { createSdk, readSetupConfig } from "./config";
import type { ScenarioContext } from "./helpers";
import { createLogger } from "./logger";
import { loadState, saveState } from "./state";

export const createScenarioContext = (title: string): ScenarioContext => {
  const config = readSetupConfig();
  const logger = createLogger();
  const state = loadState(config);
  const sdk = createSdk(config);

  logger.section(title);
  logger.resource("config", {
    run_id: config.runId,
    destructive: config.destructive,
    urls: config.urls,
  });

  return {
    config,
    logger,
    sdk,
    state,
  };
};

export const finishScenario = (context: ScenarioContext): void => {
  saveState(context.config, context.state);
  context.logger.summary(context.state);
};
