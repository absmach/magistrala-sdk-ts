import SDK from "../src/sdk";

const defaultUrl = "http://localhost";

const mySdk = new SDK({
  domainsUrl: defaultUrl + ":9003",
  usersUrl: defaultUrl + ":9002",
});

const token = "token";
const domainId = "<domainID>";

mySdk.domains
  .CreateDomain({ name: "<domainName>", alias: "<domainAlias>" }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .UpdateDomain({ name: "<domainName>", id: domainId }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .Domain(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .DomainPermissions(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .Domains({ offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .ListUserDomains("<userID>", { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .ListDomainUsers(domainId, { offset: 0, limit: 10 }, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .EnableDomain(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .DisableDomain(domainId, token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .AddUsertoDomain(domainId, ["<userID>", "<userID>"], "administrator", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .RemoveUserfromDomain(domainId, "<userID>", token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .ListDomainActions(token)
  .then((response: any) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.log(error);
  });

mySdk.domains
  .CreateDomainRole(domainId, "<roleName>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .ListDomainRoles(domainId, { offset: 0, limit: 10 }, token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .ViewDomainRole(domainId, "<role_name>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .UpdateDomainRole(
    domainId,
    "<role_name>",
    { name: "<updated_role_name>" },
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .DeleteDomainRole(domainId, "<roleName>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .AddDomainRoleActions(
    domainId,
    "<roleName>",
    ["<roleAction1>", "<roleAction2>"],
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .ListDomainRoleActions(domainId, "<roleName>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .DeleteDomainRoleActions(
    domainId,
    "<roleName>",
    ["<roleAction1>", "<roleAction2>"],
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .DeleteAllDomainRoleActions(domainId, "<roleName>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .AddDomainRoleMembers(
    domainId,
    "<roleName>",
    ["<member1>", "<member2>"],
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .ListDomainRoleMembers(
    domainId,
    "<roleName>",
    { offset: 0, limit: 10 },
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .DeleteDomainRoleMembers(
    domainId,
    "<roleName>",
    ["<member1>", "<member2>"],
    token
  )
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });

mySdk.domains
  .DeleteAllDomainRoleMembers(domainId, "<roleName>", token)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    console.error(error);
  });
