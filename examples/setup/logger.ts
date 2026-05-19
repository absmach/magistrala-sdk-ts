// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable class-methods-use-this, no-console, import/prefer-default-export */

import type { SetupState } from "./state";

export class SetupLogger {
  section(title: string): void {
    console.log(`\n== ${title} ==`);
  }

  info(message: string): void {
    console.log(message);
  }

  resource(label: string, value: unknown): void {
    console.log(`\n${label}`);
    console.log(JSON.stringify(value, null, 2));
  }

  skipped(label: string, reason: string): void {
    console.log(`- skipped ${label}: ${reason}`);
  }

  error(label: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`- ${label} failed: ${message}`);
  }

  summary(state: SetupState): void {
    const summary = {
      run_id: state.runId,
      state_contains_secrets: true,
      user: state.user
        ? {
          id: state.user.data.id,
          email: state.user.credentials.email,
          username: state.user.credentials.username,
          password: state.user.credentials.password,
          access_token: state.user.token.access_token,
          refresh_token: state.user.token.refresh_token,
        }
        : undefined,
      secondary_user: state.secondaryUser
        ? {
          id: state.secondaryUser.data.id,
          email: state.secondaryUser.credentials.email,
          username: state.secondaryUser.credentials.username,
          password: state.secondaryUser.credentials.password,
          access_token: state.secondaryUser.token.access_token,
          refresh_token: state.secondaryUser.token.refresh_token,
        }
        : undefined,
      domains: state.domains.map((domain) => ({
        id: domain.data.id,
        name: domain.data.name,
        route: domain.data.route,
        groups: domain.groups.map((group) => ({
          id: group.id,
          name: group.name,
        })),
        clients: domain.clients.map((client) => ({
          id: client.data.id,
          name: client.data.name,
          secret: client.secret,
        })),
        channels: domain.channels.map((channel) => ({
          id: channel.id,
          name: channel.name,
        })),
        connections: domain.connections,
        save_rule_id: domain.saveRule?.id,
        alarm_rule_id: domain.alarmRule?.id,
        message_names: Array.from(
          new Set(domain.messages.flatMap((message) => message.names))
        ),
        report_config_ids: domain.reportConfigs.map((config) => config.id),
      })),
      pats: state.pats.map((pat) => ({
        id: pat.id,
        name: pat.name,
        secret: pat.secret,
      })),
      certs: state.certs.map((cert) => ({
        client_id: cert.client_id,
        cert_serial: cert.cert_serial,
      })),
      bootstrap_configs: state.bootstrapConfigs.map((config) => ({
        id: config.id,
        external_id: config.external_id,
        external_key: config.external_key,
      })),
      bootstrap_profiles: state.bootstrapProfiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
      })),
      alarms: state.alarms.map((alarm) => ({
        id: alarm.id,
        rule_id: alarm.rule_id,
        status: alarm.status,
        severity: alarm.severity,
      })),
    };

    this.resource("COPYABLE SUMMARY", summary);
  }
}

export const createLogger = (): SetupLogger => new SetupLogger();
