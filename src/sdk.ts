// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Users from "./users";
import Domains from "./domains";
import Certs from "./certs";
import Groups from "./groups";
import Channels from "./channels";
import Messages from "./messages";
import Bootstrap from "./bootstrap";
import Journal from "./journal";
import Health from "./health";
import Clients from "./clients";
import Rules from "./re";
import PATs from "./pats";
import Alarms from "./alarms";

export type {
  User,
  UsersPage,
  ClientBasicInfo,
  Client,
  ClientsPage,
  GroupBasicInfo,
  Group,
  GroupsPage,
  HierarchyPageMeta,
  HierarchyPage,
  ChannelBasicInfo,
  Channel,
  ChannelsPage,
  Login,
  BasicPageMeta,
  PageMetadata,
  Token,
  Response,
  Domain,
  DomainsPage,
  Cert,
  CertsPage,
  Invitation,
  InvitationsPage,
  InvitationPageMeta,
  UserCredentials,
  ClientCredentials,
  UserBasicInfo,
  DomainBasicInfo,
  Permissions,
  Status,
  MessagesPage,
  SenMLMessage,
  MessagesPageMetadata,
  BootstrapConfig,
  BootstrapPage,
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
  Recurring,
  Schedule,
  RuleStatus,
  Rule,
  RulesPageMetadata,
  RulesPage,
  EntityType,
  Operation,
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
} from "./defs";

const defaultUrl = "http://localhost";

export interface SDKConfig {
  usersUrl?: string;
  channelsUrl?: string;
  domainsUrl?: string;
  clientsUrl?: string;
  groupsUrl?: string;
  certsUrl?: string;
  readersUrl?: string;
  httpAdapterUrl?: string;
  bootstrapUrl?: string;
  journalUrl?: string;
  rulesUrl?: string;
  authUrl?: string;
  alarmsUrl?: string;
}

class SDK {
  users: Users;

  domains: Domains;

  clients: Clients;

  certs: Certs;

  groups: Groups;

  channels: Channels;

  messages: Messages;

  bootstrap: Bootstrap;

  Journal: Journal;

  Health: Health;

  Rules: Rules;

  PATs: PATs;

  Alarms: Alarms;

  constructor({
    usersUrl = defaultUrl,
    channelsUrl = defaultUrl,
    domainsUrl = defaultUrl,
    clientsUrl = defaultUrl,
    groupsUrl = defaultUrl,
    certsUrl = defaultUrl,
    readersUrl = defaultUrl,
    httpAdapterUrl = defaultUrl,
    bootstrapUrl = defaultUrl,
    journalUrl = defaultUrl,
    rulesUrl = defaultUrl,
    authUrl = defaultUrl,
    alarmsUrl = defaultUrl,
  }: SDKConfig = {}) {
    this.users = new Users({ usersUrl, clientsUrl });
    this.domains = new Domains({ domainsUrl });
    this.clients = new Clients({ clientsUrl });
    this.certs = new Certs(certsUrl);
    this.groups = new Groups({ groupsUrl });
    this.channels = new Channels({ channelsUrl });
    this.messages = new Messages({ readersUrl, httpAdapterUrl });
    this.bootstrap = new Bootstrap(bootstrapUrl);
    this.Journal = new Journal(journalUrl);
    this.Health = new Health({
      usersUrl,
      clientsUrl,
      channelsUrl,
      bootstrapUrl,
      certsUrl,
      readersUrl,
      httpAdapterUrl,
      journalUrl,
      domainsUrl,
      groupsUrl,
      authUrl,
    });
    this.Rules = new Rules({ rulesUrl });
    this.PATs = new PATs({ authUrl });
    this.Alarms = new Alarms({ alarmsUrl });
  }
}

export default SDK;
