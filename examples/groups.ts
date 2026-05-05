// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mgSdk = new SDK({
  groupsUrl: `${defaultUrl}:9004`,
});

const token = "<token>";
const domainId = "<domainId>";

mgSdk.Groups.create(
  {
    name: "<groupName>",
  },
  domainId,
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.get("<groupId>", domainId, token, false)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.list({ offset: 0, limit: 10 }, domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.update(
  {
    name: "<groupName>",
    id: "<groupId>",
  },
  domainId,
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.enable("<groupId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.disable("<groupId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.delete("<groupId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.addParent("<groupId>", domainId, "<parentId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.getHierarchy(
  "<groupId>",
  domainId,
  { direction: 1 },
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.removeParent("<groupId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.addChildren(
  "<groupId>",
  domainId,
  ["<groupId>", "<groupId>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.removeChildren(
  "<groupId>",
  domainId,
  ["<groupId>", "<groupId>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.removeAllChildren("<groupId>", domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.listChildren(
  "<groupId>",
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

mgSdk.Groups.listActions(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.createRole("<groupId>", domainId, "<roleName>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.listRoles(
  "<groupId>",
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

mgSdk.Groups.getRole("<groupId>", domainId, "<roleId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.updateRole(
  "<groupId>",
  domainId,
  "<roleId>",
  { name: "<updatedRoleName>" },
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .then((error) => {
    console.error(error);
  });

mgSdk.Groups.deleteRole("<groupId>", domainId, "<roleId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.addRoleActions(
  "<groupId>",
  domainId,
  "<roleId>",
  ["<action>", "<action>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.listRoleActions("<groupId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.deleteRoleActions(
  "<groupId>",
  domainId,
  "<roleId>",
  ["<action>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.deleteAllRoleActions("<groupId>", domainId, "<roleId>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.addRoleMembers(
  "<groupId>",
  domainId,
  "<roleId>",
  ["<userId>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.listRoleMembers(
  "<groupId>",
  domainId,
  "<roleId>",
  { offset: 0, limit: 10 },
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.deleteRoleMembers(
  "<groupId>",
  domainId,
  "<roleId>",
  ["<userId>"],
  token
)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.deleteAllRoleMembers("<groupId>", domainId, "<roleId>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mgSdk.Groups.listMembers(
  "<groupId>",
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
