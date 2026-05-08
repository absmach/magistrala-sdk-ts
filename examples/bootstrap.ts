// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  bootstrapUrl: `${defaultUrl}:9013`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Bootstrap.add(
  {
    external_id: "<externalId>",
    external_key: "externalKey",
    id: "<clientId>",
    name: "<bootstrapName>",
  },
  domainId,
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.whitelist("<clientId>", "enabled", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.update(
  {
    name: "<updatedBootstrapName>",
    id: "<clientId>",
  },
  domainId,
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.get("<clientId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.updateCerts(
  {
    id: "<clientId>",
    client_cert: "<clientCert>",
    client_key: "<clientKey>",
    ca_cert: "<caCert>",
  },
  domainId,
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.delete("<clientId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.getByExternalId("externalId", "externalKey")
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.list({ offset: 0, limit: 10 }, domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.updateConnection(
  "<clientId>",
  domainId,
  ["<channelId>", "<channelId2>"],
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.getSecure("<externalId>", "<externalKey>", "<cryptoKey>")
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });
