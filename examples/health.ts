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
mgSdk.Health.check("clients")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Users service Health
mgSdk.Health.check("users")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Channels service Health
mgSdk.Health.check("channels")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Bootstrap service Health
mgSdk.Health.check("bootstrap")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Certs service Health
mgSdk.Health.check("certs")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Reader service Health
mgSdk.Health.check("reader")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Http Adapter service Health
mgSdk.Health.check("http-adapter")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Journal service Health
mgSdk.Health.check("journal")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Invitations service Health
mgSdk.Health.check("invitations")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Domains service Health
mgSdk.Health.check("domains")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

// Groups service Health
mgSdk.Health.check("groups")
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
