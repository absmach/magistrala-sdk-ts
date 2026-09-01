// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  alarmsUrl: `${defaultUrl}:8050`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Alarms.list(
  domainId,
  {
    offset: 0,
    limit: 10,
  },

  token
)
  .then((alarmsPage: any) => {
    console.log("List of alarms:", alarmsPage);
  })
  .catch((error) => {
    console.error("Error listing alarms:", error);
  });

mgSdk.Alarms.view(domainId, "<alarm_id>", token)
  .then((alarm: any) => {
    console.log("Alarm details:", alarm);
  })
  .catch((error) => {
    console.error("Error viewing alarm:", error);
  });

mgSdk.Alarms.update(
  domainId,
  "<alarm_id>",
  {
    status: "cleared",
  },
  token
)
  .then((response: any) => {
    console.log("Updated alarm:", response);
  })
  .catch((error) => {
    console.error("Error updating alarm:", error);
  });

mgSdk.Alarms.delete(domainId, "<alarm_id>", token)
  .then((res: any) => {
    console.log("Delete response:", res);
  })
  .catch((error) => {
    console.error("Error deleting alarm:", error);
  });
