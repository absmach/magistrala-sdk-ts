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

mgSdk.Bootstrap.updateStatus("<configId>", "enabled", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.update(
  {
    name: "<updatedBootstrapName>",
    id: "<configId>",
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

mgSdk.Bootstrap.get("<configId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.updateCerts(
  {
    id: "<configId>",
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

mgSdk.Bootstrap.delete("<configId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.getByExternalId("<externalId>", "<externalKey>")
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

mgSdk.Bootstrap.getSecure("<externalId>", "<externalKey>", "<cryptoKey>")
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.createProfile(
  {
    name: "<profileName>",
    description: "<profileDescription>",
    template_format: "json",
    content_template: '{"key": "{{ .value }}"}',
    defaults: { value: "default" },
    binding_slots: [
      { name: "sensor", type: "client", required: true, fields: ["id"] },
    ],
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

mgSdk.Bootstrap.uploadProfile(
  JSON.stringify({
    name: "<profileName>",
    template_format: "json",
    content_template: '{"key": "{{.value}}"}',
    defaults: { value: "default" },
  }),
  "application/json",
  domainId,
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.viewProfile("<profileId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.updateProfile(
  {
    id: "<profileId>",
    name: "<updatedProfileName>",
    description: "<updatedDescription>",
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

mgSdk.Bootstrap.listProfiles({ offset: 0, limit: 10 }, domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.deleteProfile("<profileId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.assignProfile("<configId>", "<profileId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.bindResources(
  "<configId>",
  [
    { slot: "sensor", type: "client", resource_id: "<clientId>" },
    { slot: "data", type: "channel", resource_id: "<channelId>" },
  ],
  domainId,
  token
)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.listBindings("<configId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.refreshBindings("<configId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.profileSlots("<profileId>", domainId, token)
  .then((response: any) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Bootstrap.renderPreview(
  "<profileId>",
  {
    config: { id: "<configId>" },
    render_context: { value: "example" },
    bindings: [
      {
        config_id: "<configId>",
        slot: "sensor",
        type: "client",
        resource_id: "<clientId>",
        snapshot: { id: "<clientId>" },
      },
    ],
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
