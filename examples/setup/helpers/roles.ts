// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/prefer-default-export */

import type { Role } from "../../../src/sdk";
import type { SetupLogger } from "../logger";
import { tryDuplicateSafeStep, tryStep } from "./common";

interface RoleLifecycle {
  label: string;
  destructive: boolean;
  memberId?: string;
  listActions: () => Promise<string[]>;
  createRole: (roleName: string) => Promise<Role>;
  listRoles: () => Promise<unknown>;
  getRole: (roleId: string) => Promise<unknown>;
  updateRole: (roleId: string, role: Role) => Promise<unknown>;
  addRoleActions: (roleId: string, actions: string[]) => Promise<unknown>;
  listRoleActions: (roleId: string) => Promise<unknown>;
  deleteRoleActions: (roleId: string, actions: string[]) => Promise<unknown>;
  deleteAllRoleActions: (roleId: string) => Promise<unknown>;
  addRoleMembers: (roleId: string, members: string[]) => Promise<unknown>;
  listRoleMembers: (roleId: string) => Promise<unknown>;
  deleteRoleMembers: (roleId: string, members: string[]) => Promise<unknown>;
  deleteAllRoleMembers: (roleId: string) => Promise<unknown>;
  listMembers: () => Promise<unknown>;
  deleteRole: (roleId: string) => Promise<unknown>;
}

export const runRoleLifecycle = async (
  logger: SetupLogger,
  lifecycle: RoleLifecycle
): Promise<void> => {
  const actions = await tryStep(logger, `${lifecycle.label}.actions`, lifecycle.listActions);
  const role = await tryStep(logger, `${lifecycle.label}.role.create`, () => lifecycle.createRole(`${lifecycle.label}-setup-role`));
  await tryStep(logger, `${lifecycle.label}.roles.list`, lifecycle.listRoles);

  if (!role?.id) {
    logger.skipped(`${lifecycle.label}.role.detail`, "created role did not include an id");
    return;
  }

  await tryStep(logger, `${lifecycle.label}.role.get`, () => lifecycle.getRole(role.id as string));
  await tryStep(logger, `${lifecycle.label}.role.update`, () => lifecycle.updateRole(role.id as string, {
    name: `${lifecycle.label}-setup-role-updated`,
  }));

  const action = actions?.[0];
  if (action) {
    await tryStep(logger, `${lifecycle.label}.role.actions.add`, () => lifecycle.addRoleActions(role.id as string, [action]));
    await tryStep(logger, `${lifecycle.label}.role.actions.list`, () => lifecycle.listRoleActions(role.id as string));
  } else {
    logger.skipped(`${lifecycle.label}.role.actions`, "no available actions returned");
  }

  if (lifecycle.memberId) {
    await tryDuplicateSafeStep(logger, `${lifecycle.label}.role.members.add`, () => lifecycle.addRoleMembers(role.id as string, [lifecycle.memberId as string]));
    await tryStep(logger, `${lifecycle.label}.role.members.list`, () => lifecycle.listRoleMembers(role.id as string));
  } else {
    logger.skipped(`${lifecycle.label}.role.members`, "no member id available");
  }
  await tryStep(logger, `${lifecycle.label}.members.list`, lifecycle.listMembers);

  if (!lifecycle.destructive) {
    logger.skipped(`${lifecycle.label}.role.cleanup`, "set MG_RUN_DESTRUCTIVE=true");
    return;
  }

  if (action) {
    await tryStep(logger, `${lifecycle.label}.role.actions.delete`, () => lifecycle.deleteRoleActions(role.id as string, [action]));
  }
  await tryStep(logger, `${lifecycle.label}.role.actions.deleteAll`, () => lifecycle.deleteAllRoleActions(role.id as string));
  if (lifecycle.memberId) {
    await tryStep(logger, `${lifecycle.label}.role.members.delete`, () => lifecycle.deleteRoleMembers(role.id as string, [lifecycle.memberId as string]));
  }
  await tryStep(logger, `${lifecycle.label}.role.members.deleteAll`, () => lifecycle.deleteAllRoleMembers(role.id as string));
  await tryStep(logger, `${lifecycle.label}.role.delete`, () => lifecycle.deleteRole(role.id as string));
};
