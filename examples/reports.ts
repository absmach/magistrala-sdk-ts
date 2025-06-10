// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  reportsUrl: `${defaultUrl}:9009`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Reports.generateReport(
  domainId,
  {
    name: "report 1",
    description: "This is my first report",
    config: {
      title: "Report Title",
      from: "now()-5d",
      to: "now()",
      aggregation: {
        agg_type: "",
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

mgSdk.Reports.addReportConfig(
  domainId,
  {
    name: "report 1",
    description: "This is my first report",
    config: {
      title: "Report Title",
      from: "now()-5d",
      to: "now()",
      aggregation: {
        agg_type: "",
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
      to: [
        "user1@example.com"
      ],
      subject: "Instant report from Magistrala stage",
      content: "Hi, \n Please find the attached instant report from Magistrala stage"
    }
  },
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.viewReportConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.listReportConfigs(domainId, { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.updateReportConfig(
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

mgSdk.Reports.updateReportSchedule(
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

mgSdk.Reports.deleteReportConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.enableReportConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Reports.disableReportConfig(domainId, "<configId>", token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });
