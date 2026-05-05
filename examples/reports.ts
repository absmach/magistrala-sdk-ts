// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  reportsUrl: `${defaultUrl}:9017`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Reports.generate(
  domainId,
  {
    name: "report 1",
    description: "This is my first report",
    config: {
      title: "Report Title",
      from: "now()-5d",
      to: "now()",
      aggregation: {
        agg_type: undefined,
        interval: "10m",
      },
    },
    metrics: [
      {
        name: "<messageName>",
        channel_id: "<channelId>",
        client_ids: ["<clientId>"],
        subtopic: "",
        protocol: "",
      },
    ],
  },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.addConfig(
  domainId,
  {
    name: "report 1",
    description: "This is my first report",
    config: {
      title: "Report Title",
      from: "now()-5d",
      to: "now()",
      aggregation: {
        agg_type: undefined,
        interval: "10m",
      },
    },
    metrics: [
      {
        name: "<messageName>",
        channel_id: "<channelId>",
        client_ids: ["<clientId>"],
        subtopic: "",
        protocol: "",
      },
    ],
    email: {
      to: ["user1@example.com"],
      subject: "Instant report from Magistrala stage",
      content:
        "Hi, \n Please find the attached instant report from Magistrala stage",
    },
  },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.getConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.listConfigs(domainId, { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.updateConfig(
  domainId,
  { id: "<configId>", name: "<updatedName>" },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.updateSchedule(
  domainId,
  "<configId>",
  {
    start_datetime: "2025-04-24T12:00:00.000Z",
    time: "1970-01-01T10:00:00.000Z",
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

mgSdk.Reports.deleteConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.enableConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.disableConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.updateTemplate(
  domainId,
  "<reportId>",
  "<report_template>",
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.getTemplate(domainId, "<reportId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.deleteTemplate(domainId, "<reportId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.listActions(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.createRole(
  "<configId>",
  "<roleName>",
  domainId,
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.listRoles(
  "<configId>",
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

mgSdk.Reports.getRole("<configId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.updateRole(
  "<configId>",
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

mgSdk.Reports.deleteRole("<configId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.addRoleActions(
  "<configId>",
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

mgSdk.Reports.listRoleActions(
  "<configId>",
  domainId,
  "<roleId>",
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.deleteRoleActions(
  "<configId>",
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

mgSdk.Reports.deleteAllRoleActions(
  "<configId>",
  domainId,
  "<roleId>",
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.addRoleMembers(
  "<configId>",
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

mgSdk.Reports.listRoleMembers(
  "<configId>",
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

mgSdk.Reports.deleteRoleMembers(
  "<configId>",
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

mgSdk.Reports.deleteAllRoleMembers(
  "<configId>",
  domainId,
  "<roleId>",
  token
)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.listMembers(
  "<configId>",
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
