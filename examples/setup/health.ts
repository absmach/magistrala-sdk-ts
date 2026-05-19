// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

import { createScenarioContext, finishScenario } from "./context";
import { tryStep } from "./helpers";

const services = [
  "users",
  "domains",
  "groups",
  "clients",
  "channels",
  "bootstrap",
  "certs",
  "reader",
  "http-adapter",
  "journal",
  "pats",
];

const main = async (): Promise<void> => {
  const context = createScenarioContext("Health scenario");
  const { logger, sdk } = context;

  for (const service of services) {
    await tryStep(logger, `health.${service}`, () => sdk.Health.check(service));
  }

  finishScenario(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
