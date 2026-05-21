// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop, no-console */

import { createSdk, readSetupConfig } from "./config";
import {
  createPat,
  createReportConfig,
  ensureCore,
  ensureMessaging,
  requireChannel,
  requireClient,
  requireDomain,
  requireDomainId,
  requireToken,
  runStep,
  type ScenarioContext,
} from "./helpers";
import { createLogger } from "./logger";
import { loadState, saveState } from "./state";

type E2EMode = "core" | "messaging" | "reports" | "all";

const readMode = (): E2EMode => {
  const requested = process.argv
    .slice(2)
    .find((arg) => !arg.startsWith("--")) ?? "all";
  if (
    requested === "core" ||
    requested === "messaging" ||
    requested === "reports" ||
    requested === "all"
  ) {
    return requested;
  }
  throw new Error(
    `Unknown mode '${requested}'. Use one of: core, messaging, reports, all.`
  );
};

const runReports = async (context: ScenarioContext): Promise<void> => {
  const {
    config,
    logger,
    sdk,
    state,
  } = context;
  logger.section("Reports setup");
  await ensureMessaging(context);
  await createPat(context, 0);
  await createPat(context, 1);

  const token = requireToken(state).access_token;
  const domain = requireDomain(state);
  const domainId = requireDomainId(domain);
  const client = requireClient(domain);
  const channel = requireChannel(domain);

  for (let index = 0; index < 2; index += 1) {
    const configForReport = await createReportConfig(
      context,
      domain,
      client,
      channel,
      index
    );
    const generated = await runStep(logger, `report.${index}.generate`, () => sdk.Reports.generate(domainId, configForReport, token));
    domain.reports.push(generated);
  }

  saveState(config, state);
  logger.summary(state);
};

const main = async (): Promise<void> => {
  const mode = readMode();
  const config = readSetupConfig();
  const logger = createLogger();
  const state = loadState(config);
  const sdk = createSdk(config);
  const context = {
    config,
    logger,
    sdk,
    state,
  };

  logger.section(`E2E mode: ${mode}`);
  logger.resource("config", {
    run_id: config.runId,
    destructive: config.destructive,
    urls: config.urls,
  });

  if (mode === "core") {
    await ensureCore(context, { domainCount: 3, perDomainCount: 5 });
    logger.summary(state);
    return;
  }

  if (mode === "messaging") {
    await ensureMessaging(context);
    logger.summary(state);
    return;
  }

  if (mode === "reports") {
    await runReports(context);
    return;
  }

  await runReports(context);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
