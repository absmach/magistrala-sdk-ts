// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  httpAdapterUrl: `${defaultUrl}:8008`,
  readersUrl: `${defaultUrl}:9011`,
});

const token = "<token>";
const domainId = "<domainId>";
const topic = "<channel>/<subtopic>";
const payload = '[{"n":"rest","bu":"m","u":"m","bt":1986694772310,"v":30}]';


mgSdk.Messages
  .Send(
    domainId,
    topic,
    payload,
    token
  )
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Messages
  .Read(domainId, topic, { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
