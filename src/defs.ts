// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

export interface UserBasicInfo {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  credentials?: UserCredentials;
  status?: Status;
  profile_picture?: string;
}

export interface User extends UserBasicInfo {
  role?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string | UserBasicInfo;
  permissions?: string[];
}

export interface UsersPage {
  users: User[];
  total: number;
  offset: number;
  limit: number;
}

export interface UserCredentials {
  username?: string;
  secret?: string;
}

export interface ClientCredentials {
  identity?: string;
  secret?: string;
}

export interface ClientBasicInfo {
  id?: string;
  name?: string;
  credentials?: ClientCredentials;
  status?: Status;
}

export const QueryParamRoles = "roles";

export interface Client extends ClientBasicInfo {
  tags?: string[];
  domain_id?: string | DomainBasicInfo;
  parent_group_id?: string;
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string | UserBasicInfo;
  identity?: string;
  parent_group_path?: string;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  access_type?: string;
  access_provider_id?: string;
  access_provider_role_id?: string;
  access_provider_role_name?: string;
  access_provider_role_actions?: string[];
  connection_types?: string[];
  member_id?: string;
  roles?: MemberRoleActions[];
}

export interface ClientsPage {
  clients: Client[];
  total: number;
  offset: number;
  limit: number;
}

export interface GroupBasicInfo {
  id?: string;
  name?: string;
  status?: Status;
  description?: string;
}

export interface Group extends GroupBasicInfo {
  domain_id?: string | DomainBasicInfo;
  parent_id?: string | GroupBasicInfo;
  metadata?: Record<string, any>;
  level?: number;
  path?: string;
  children?: Group[];
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string | UserBasicInfo;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  access_type?: string;
  access_provider_id?: string;
  access_provider_role_id?: string;
  access_provider_role_name?: string;
  access_provider_role_actions?: string[];
  member_id?: string;
  roles?: MemberRoleActions[];
}

export interface GroupsPage {
  groups: Group[];
  total: number;
  offset: number;
  limit: number;
}

export interface HierarchyPageMeta {
  level?: number;
  direction?: number; // ancestors (+1) or descendants (-1)
  // - `true`  - result is JSON tree representing groups hierarchy,
  // - `false` - result is JSON array of groups.
  tree?: boolean;
}

export interface HierarchyPage extends HierarchyPageMeta {
  groups: Group[];
}

export interface ChannelBasicInfo {
  id?: string;
  name?: string;
  status?: Status;
}

export interface Channel extends ChannelBasicInfo {
  domain_id?: string | DomainBasicInfo;
  metadata?: Record<string, any>;
  tags?: string[];
  parent_group_id?: string;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
  parent_group_path?: string;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  access_type?: string;
  access_provider_id?: string;
  access_provider_role_id?: string;
  access_provider_role_name?: string;
  access_provider_role_actions?: string[];
  connection_types?: string[];
  member_id?: string;
  roles?: MemberRoleActions[];
}

export interface ChannelsPage {
  channels: Channel[];
  total: number;
  offset: number;
  limit: number;
}

export interface Login {
  username?: string;
  password?: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  access_type?: string;
}

export interface DomainBasicInfo {
  id?: string;
  name?: string;
  route?: string;
  status?: Status;
}

export interface Domain extends DomainBasicInfo {
  tags?: string[];
  metadata?: Record<string, any>;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  created_by?: string | UserBasicInfo;
  updated_by?: string | UserBasicInfo;
  created_at?: Date;
  updated_at?: Date;
  member_id?: string;
  roles?: MemberRoleActions[];
}

export interface DomainsPage {
  domains: Domain[];
  total: number;
  offset: number;
  limit: number;
}

export interface Permissions {
  permissions: string[];
}

export interface Invitation {
  invited_by: string | UserBasicInfo;
  invitee_user_id: string | UserBasicInfo;
  domain_id: string | DomainBasicInfo;
  domain_name?: string;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  created_at?: Date;
  updated_at?: Date;
  confirmed_at?: Date;
  rejected_at?: Date;
}

export interface InvitationsPage {
  invitations: Invitation[];
  total: number;
  offset: number;
  limit: number;
}

export interface Response {
  status: number;
  message?: string;
}

export type Status = "enabled" | "disabled";

export interface BasicPageMeta {
  total?: number;
  offset?: number;
  limit?: number;
}
export interface PageMetadata extends BasicPageMeta {
  total?: number;
  offset?: number;
  limit?: number;
  order?: string;
  dir?: string;
  level?: number;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  type?: string;
  metadata?: Record<string, any>;
  status?: string;
  action?: string;
  subject?: string;
  object?: string;
  tag?: string;
  id?: string;
  tree?: boolean;
  owner?: string;
  shared_by?: string;
  visibility?: string;
  owner_id?: string;
  topic?: string;
  contact?: string;
  state?: string;
  list_perms?: boolean;
  invited_by?: string;
  domain?: string;
  user_id?: string;
  relation?: string;
  from?: number;
  to?: number;
  access_type?: string;
  actions?: string[];
  role_id?: string;
  role_name?: string;
  group?: string;
  client?: string;
  channel?: string;
  connection_type?: string;
  root_group?: boolean;
}

export interface MessagesPage {
  messages: SenMLMessage[];
  total: number;
  offset: number;
  limit: number;
}

export interface MessagesPageMetadata extends PageMetadata {
  subtopic?: string;
  publisher?: string | ClientBasicInfo;
  protocol?: string;
  comparator?: string;
  vb?: boolean;
  vs?: string;
  vd?: string;
  aggregation?: string;
  interval?: string;
  v?: number;
}

export interface SenMLMessage {
  channel?: string | ChannelBasicInfo;
  subtopic?: string;
  publisher?: string | ClientBasicInfo;
  protocol?: string;
  name?: string;
  unit?: string;
  time?: number;
  update_time?: number;
  value?: number | null;
  string_value?: string | null;
  data_value?: string | null;
  bool_value?: boolean | null;
  sum?: number | null;
}

export interface Cert {
  client_id?: string;
  cert_serial?: string;
  client_key?: string;
  client_cert?: string;
  expiration?: string;
}

export interface CertsPage {
  certs: Cert[];
  total: number;
  offset: number;
  limit: number;
}

export interface BootstrapConfig {
  channels?: string[];
  external_id?: string;
  external_key?: string;
  client_id?: string;
  client_secret?: string;
  name?: string;
  client_cert?: string;
  client_key?: string;
  ca_cert?: string;
  content?: string;
  state?: number;
  encryptedBootstrap?: string;
  decrypted_key?: string;
  encrypted_buffer?: string;
  decrypted?: string;
}

export interface BootstrapPage {
  configs: BootstrapConfig[];
  total: number;
  offset: number;
  limit: number;
}

export interface JournalsPageMetadata extends PageMetadata {
  operation?: string;
  with_metadata?: boolean;
  with_attributes?: boolean;
  id?: string;
}

export interface Journal {
  id?: string;
  operation?: string;
  occurred_at?: string;
  payload?: Record<string, any>;
}

export interface JournalsPage {
  journals: Journal[];
  total: number;
  offset: number;
  limit: number;
}

export interface HealthInfo {
  status: string;
  version: string;
  commit: string;
  description: string;
  build_time: string;
  instance_id: string;
}

export interface Role {
  id?: string;
  name?: string;
  entity_id?: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
}

export interface RoleProvision extends Role {
  optional_actions?: string[];
  optional_members?: string[];
}

export interface RolePage {
  roles: Role[];
  total: number;
  offset: number;
  limit: number;
}

export interface MemberRoleActions {
  role_id?: string;
  role_name?: string;
  actions?: string[];
  access_provider_id?: string;
  access_provider_path?: string;
  access_type?: string;
}

export interface MemberRoles {
  member_id?: string;
  roles?: MemberRoleActions[];
}

export interface MemberRolesPage {
  members: MemberRoles[];
  total: number;
  offset: number;
  limit: number;
}

export interface MembersRolePageQuery {
  total?: number;
  offset?: number;
  limit?: number;
  order_by?: string;
  dir?: string;
  access_provider_id?: string;
  role_id?: string;
  role_name?: string;
  actions?: string[];
  access_type?: string;
}

export interface EntityActionRole {
  entity_id?: string;
  action?: string;
  role_id?: string;
}

export interface EntityMemberRole {
  entity_id?: string;
  member_id?: string;
  role_id?: string;
}

export interface MembersPage {
  members: string[];
  total: number;
  offset: number;
  limit: number;
}

export type ScriptKind = "channels" | "save_senml" | "alarms" | "email" | "save";
export interface Script {
  type: number;
  kind: ScriptKind;
  value: string;
}

export type Recurring = "daily" | "weekly" | "monthly" | "none";

export interface Schedule {
  start_datetime: string;
  time: string;
  recurring: Recurring;
  recurring_period: number;
}

export type RuleStatus = "enabled" | "disabled" | "deleted" | "all" | "unknown";
export interface Rule {
  id?: string;
  name?: string;
  domain?: string;
  metadata?: Record<string, any>;
  input_channel?: string;
  input_topic?: string;
  logic?: Script;
  output_channel?: string;
  output_topic?: string;
  schedule?: Schedule;
  status?: RuleStatus;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
}

export interface RulesPageMetadata {
  total?: number;
  offset?: number;
  limit?: number;
  dir?: string;
  name?: string;
  input_channel?: string;
  output_channel?: string;
  status?: RuleStatus;
}

export interface RulesPage extends RulesPageMetadata {
  rules: Rule[];
}

export interface ClientTelemetry {
  client_id: string;
  domain_id: string;
  subscriptions: number;
  inbound_messages: number;
  outbound_messages: number;
  first_seen: Date;
  last_seen: Date;
}

export interface InvitationPageMeta extends BasicPageMeta {
  invited_by?: string;
  invitee_user_id?: string;
  domain_id?: string;
  role_id?: string;
  invited_by_or_user_id?: string;
  state?: string;
}

export type EntityType =
  | "groups"
  | "channels"
  | "clients"
  | "domains"
  | "users"
  | "dashboards"
  | "messages";

export type Operation =
  | "create"
  | "read"
  | "list"
  | "update"
  | "delete"
  | "share"
  | "unshare"
  | "publish"
  | "subscribe";
export interface Scope {
  id?: string;
  pat_id?: string;
  entity_type?: EntityType;
  optional_domain_id?: string;
  operation?: Operation;
  entity_id?: string;
}

export type PatStatus = "active" | "revoked" | "expired" | "all";
export interface PAT {
  id?: string;
  user?: string;
  name?: string;
  description?: string;
  secret?: string;
  scope?: Scope[];
  status?: PatStatus;
  issued_at?: Date;
  expires_at?: Date;
  updated_at?: Date;
  last_used_at?: Date;
  revoked?: boolean;
  revoked_at?: Date;
}

export interface PATsPage {
  pats: PAT[];
  total: number;
  offset: number;
  limit: number;
}

export interface ScopesPage {
  scopes: Scope[];
  total: number;
  offset: number;
  limit: number;
}

export interface PatPageMeta extends BasicPageMeta {
  status?: PatStatus;
  name?: string;
  id?: string;
}
export interface ScopesPageMeta extends BasicPageMeta {
  pat_id?: string;
  id?: string;
}

export type AlarmStatus = "active" | "cleared" | "all";

export interface Alarm {
  id?: string;
  rule_id?: string;
  domain_id?: string;
  channel_id?: string;
  client_id?: string;
  subtopic?: string;
  measurement?: string;
  value?: string;
  unit?: string;
  threshold?: string;
  cause?: string;
  status?: AlarmStatus;
  severity?: number;
  assignee_id?: string;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
  assigned_at?: Date;
  assigned_by?: string;
  acknowledged_at?: Date;
  acknowledged_by?: string;
  resolved_at?: Date;
  resolved_by?: string;
  metadata?: Record<string, any>;
}

export interface AlarmsPage {
  offset: number;
  limit: number;
  total: number;
  alarms: Alarm[];
}

export interface AlarmPageMeta extends BasicPageMeta {
  domain_id?: string;
  channel_id?: string;
  client_id?: string;
  subtopic?: string;
  rule_id?: string;
  status?: AlarmStatus;
  assignee_id?: string;
  severity?: number;
  updated_by?: string;
  assigned_by?: string;
  acknowledged_by?: string;
  resolved_by?: string;
}
