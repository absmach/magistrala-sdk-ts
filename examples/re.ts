// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK, { OutputType } from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  rulesUrl: `${defaultUrl}:9008`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Rules.create(domainId, { name: "<ruleName>" }, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.list(domainId, { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.view("<ruleId>", domainId, token)
  .then((response: any) => {
    console.log(response);
  })
  .catch((error: any) => {
    console.error(error);
  });

mgSdk.Rules.update(
  domainId,
  {
    id: "<ruleId>",
    name: "<updatedName>",
    logic: {
      type: 1,
      value: "<value>",
    },
    outputs: [{ type: "save_senml" as OutputType }],
  },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.updateTags(domainId, "<ruleId>", ["tag1", "tag2"], token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.updateSchedule(
  domainId,
  "<ruleId>",
  {
    start_datetime: "2025-02-07T03:14:00.000Z",
    time: "0001-01-01T07:39:44.000Z",
    recurring: "daily",
    recurring_period: 1,
  },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.delete(domainId, "<ruleId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.disable(domainId, "<ruleId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.enable(domainId, "<ruleId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.listActions(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.createRole("<ruleId>", "<roleName>", domainId, token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.listRoles("<ruleId>", domainId, { offset: 0, limit: 10 }, token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.getRole("<ruleId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.updateRole(
  "<ruleId>",
  domainId,
  "<roleId>",
  { name: "<updatedRoleName>" },
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.deleteRole("<ruleId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.addRoleActions(
  "<ruleId>",
  domainId,
  "<roleId>",
  ["<action>", "<action>"],
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.listRoleActions("<ruleId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.deleteRoleActions(
  "<ruleId>",
  domainId,
  "<roleId>",
  ["<action>", "<action>"],
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.deleteAllRoleActions("<ruleId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.addRoleMembers(
  "<ruleId>",
  domainId,
  "<roleId>",
  ["<userId>", "<userId>"],
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.listRoleMembers(
  "<ruleId>",
  domainId,
  "<roleId>",
  { offset: 0, limit: 10 },
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.deleteRoleMembers(
  "<ruleId>",
  domainId,
  "<roleId>",
  ["<userId>", "<userId>"],
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.deleteAllRoleMembers("<ruleId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Rules.listMembers(
  "<ruleId>",
  domainId,
  { offset: 0, limit: 10 },
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
