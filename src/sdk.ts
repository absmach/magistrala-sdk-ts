// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Certs from "./certs";
import Messages from "./messages";
import Bootstrap from "./bootstrap";
import Journal from "./journal";
import Health from "./health";
import Rules from "./re";
import PATs from "./pats";
import Alarms from "./alarms";
import Reports from "./reports";

export type {
  UserBasicInfo,
  User,
  UsersPage,
  UserCredentials,
  DeviceCredentials,
  DeviceBasicInfo,
  Device,
  DevicesPage,
  GroupBasicInfo,
  Group,
  GroupsPage,
  HierarchyPageMeta,
  HierarchyPage,
  ChannelBasicInfo,
  Channel,
  ChannelsPage,
  Login,
  Token,
  WorkspaceBasicInfo,
  Workspace,
  WorkspacesPage,
  Permissions,
  Invitation,
  InvitationsPage,
  InvitationPageMeta,
  RefreshToken,
  DeviceTelemetry,
  BasicPageMeta,
  PageMetadata,
  Response,
  Cert,
  CertsPage,
  Status,
  MessagesPage,
  SenMLMessage,
  MessagesPageMetadata,
  BootstrapConfig,
  BootstrapPage,
  BootstrapStatus,
  BootstrapContentFormat,
  BootstrapProfile,
  BootstrapProfilesPage,
  BindingSlot,
  BootstrapBindingRequest,
  BootstrapBindingSnapshot,
  RenderPreviewRequest,
  Journal,
  JournalsPage,
  JournalsPageMetadata,
  HealthInfo,
  Role,
  RoleProvision,
  RolePage,
  MemberRoleActions,
  MemberRoles,
  MemberRolesPage,
  MembersRolePageQuery,
  EntityActionRole,
  EntityMemberRole,
  MembersPage,
  Script,
  ExecutionMode,
  Recurring,
  Schedule,
  OutputType,
  RuleStatus,
  Rule,
  Output,
  ChannelOutput,
  EmailOutput,
  PostgresDBOutput,
  SlackOutput,
  RulesPageMetadata,
  OrderDirection,
  OrderByField,
  RulesPage,
  EntityType,
  Scope,
  PAT,
  PATsPage,
  ScopesPage,
  ScopesPageMeta,
  PatPageMeta,
  PatStatus,
  Alarm,
  AlarmPageMeta,
  AlarmsPage,
  AlarmStatus,
  AlarmUpdate,
  Report,
  Metric,
  ReportPage,
  AggConfig,
  MetricConfig,
  EmailSetting,
  Aggregation,
  ReportConfig,
  ReportConfigPage,
  ReportConfigPageMeta,
  ReqMetric,
  Format,
  ReportFile,
  Template,
  Metadata,
} from "./defs";

const defaultUrl = "http://localhost";

export interface SDKConfig {
  certsUrl?: string;
  readersUrl?: string;
  httpAdapterUrl?: string;
  bootstrapUrl?: string;
  journalUrl?: string;
  rulesUrl?: string;
  reportsUrl?: string;
  authUrl?: string;
  alarmsUrl?: string;
}

class SDK {
  Certs: Certs;

  Messages: Messages;

  Bootstrap: Bootstrap;

  Journal: Journal;

  Health: Health;

  Rules: Rules;

  PATs: PATs;

  Alarms: Alarms;

  Reports: Reports;

  constructor({
    certsUrl = defaultUrl,
    readersUrl = defaultUrl,
    httpAdapterUrl = defaultUrl,
    bootstrapUrl = defaultUrl,
    journalUrl = defaultUrl,
    rulesUrl = defaultUrl,
    reportsUrl = defaultUrl,
    authUrl = defaultUrl,
    alarmsUrl = defaultUrl,
  }: SDKConfig = {}) {
    this.Certs = new Certs({ certsUrl });
    this.Messages = new Messages({ readersUrl, httpAdapterUrl });
    this.Bootstrap = new Bootstrap({ bootstrapUrl });
    this.Journal = new Journal({ journalUrl });
    this.Health = new Health({
      bootstrapUrl,
      certsUrl,
      readersUrl,
      httpAdapterUrl,
      journalUrl,
      authUrl,
    });
    this.Rules = new Rules({ rulesUrl });
    this.Reports = new Reports({ reportsUrl });
    this.PATs = new PATs({ authUrl });
    this.Alarms = new Alarms({ alarmsUrl });
  }
}

export default SDK;
