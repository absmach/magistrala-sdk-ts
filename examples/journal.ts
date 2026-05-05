// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  journalUrl: `${defaultUrl}:9021`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Journal.listByEntity(
  "<entityType>",
  "<entityId>",
  domainId,
  { offset: 0, limit: 10 },
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Journal.listByUser("<userId>", { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Journal.clientTelemetry("<clientId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
