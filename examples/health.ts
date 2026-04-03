// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  usersUrl: `${defaultUrl}:9002`,
  clientsUrl: `${defaultUrl}:9006`,
  channelsUrl: `${defaultUrl}:9005`,
  journalUrl: `${defaultUrl}:9021`,
  httpAdapterUrl: `${defaultUrl}/http`,
  readersUrl: `${defaultUrl}:9011`,
  domainsUrl: `${defaultUrl}:9003`,
  certsUrl: `${defaultUrl}:9019`,
  bootstrapUrl: `${defaultUrl}:9013`,
  groupsUrl: `${defaultUrl}:9004`,
});

// Clients service Health
mgSdk.Health.Health("clients")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Users service Health
mgSdk.Health.Health("users")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Channels service Health
mgSdk.Health.Health("channels")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Bootstrap service Health
mgSdk.Health.Health("bootstrap")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Certs service Health
mgSdk.Health.Health("certs")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Reader service Health
mgSdk.Health.Health("reader")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Http Adapter service Health
mgSdk.Health.Health("http-adapter")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Journal service Health
mgSdk.Health.Health("journal")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Invitations service Health
mgSdk.Health.Health("invitations")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Domains service Health
mgSdk.Health.Health("domains")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Groups service Health
mgSdk.Health.Health("groups")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
