# @absmach/magistrala-sdk

## 0.17.9

### Patch Changes

- 27fe9e6: add support for timezone

## 0.17.8

### Patch Changes

- 0e5c649: add message field to slack output interface

## 0.17.7

### Patch Changes

- 6e88bb6: update rules engine output types to include slack

## 0.17.6

### Patch Changes

- 0d58bf0: Add Messaging Page ordering fields

## 0.17.5

### Patch Changes

- 80ec31c: Fix verify email endpoint

## 0.17.4

### Patch Changes

- 9b0e0a2: add email verification functions

## 0.17.3

### Patch Changes

- ab391aa: Remove user id from delete invitation endpoint

## 0.17.2

### Patch Changes

- 0014526: Update entities sorting to include order and direction

## 0.17.1

### Patch Changes

- 5a5c741: Add order to rules page metadata

## 0.17.0

### Minor Changes

- 406e3b4: Align version to SuperMQ

## 0.13.15

### Patch Changes

- b641cf7: add tags to rule metadata

## 0.13.14

### Patch Changes

- 6159ab1: add tags implementation to rules

## 0.13.13

### Patch Changes

- 3a32172: This adds template interface

## 0.13.12

### Patch Changes

- e59e198: Add report template

## 0.13.11

### Patch Changes

- 77888f0: Update the rules outputs handling

## 0.13.10

### Patch Changes

- 8e44af9: This updates report config structs

## 0.13.9

### Patch Changes

- 7a7038b: Add a resend param to the send invitation function. This allows a user to resend an invitation that has already been rejected.

## 0.13.8

### Patch Changes

- 363e23e: Separate Reports from Rules

## 0.13.7

### Patch Changes

- 7fa2c4e: Add route to channel interface

## 0.13.6

### Patch Changes

- c5d4a3f: update reset password

## 0.13.5

### Patch Changes

- 36c9392: Update client struct

## 0.13.4

### Patch Changes

- 7ab5054: Add request metric

## 0.13.3

### Patch Changes

- 2c9a69b: This changes the clients field in metrics section of reports from a string to a string array

## 0.13.2

### Patch Changes

- c5e145f: Move file_format to metrics from email

## 0.13.1

### Patch Changes

- 5aff18e: Fixes the update schedule function

## 0.13.0

### Minor Changes

- 9191285: Adds the reports class that allows the management of reports.This class handles interactions with the reports API.

## 0.12.4

### Patch Changes

- 2c760fe: Export unexported type.

## 0.12.3

### Patch Changes

- 375ea3a: Add Script Outputs to indicate the follow-up actions.

## 0.12.2

### Patch Changes

- 383a39c: Updates the schedule json stringify

## 0.12.1

### Patch Changes

- a116aa7: refactor rules engine service to add update scheduler as well as rename the methods.

## 0.12.0

### Minor Changes

- a3e06d5: this adds the alarms service to the sdk. It allows users to create, update, view and delete alarms

## 0.11.10

### Patch Changes

- 0d9e1f3: reorder params

## 0.11.9

### Patch Changes

- 630d277: Add domainId to Send Messages

## 0.11.8

### Patch Changes

- 861f736: update send message extraction of sub topic to support multiple subtopics

## 0.11.7

### Patch Changes

- 2cd2bbf: Add a `/` in the URL

## 0.11.6

### Patch Changes

- c26c19d: This is a sync with a new messgaing API

## 0.11.5

### Patch Changes

- 931c06c: Rename domain alias to route.

## 0.11.4

### Patch Changes

- 80fe6c3: updates the send message endpoint

## 0.11.3

### Patch Changes

- d2f19e4: update view entities to have view roles query param.

## 0.11.2

### Patch Changes

- 155ac0c: Export Page Meta interface

## 0.11.1

### Patch Changes

- 36f7ec4: Add status to pats

## 0.11.0

### Minor Changes

- 9d526b6: add pats

## 0.10.15

### Patch Changes

- 1b9339f: add root_group param to page metadata

## 0.10.14

### Patch Changes

- 32bcae9: Add domain name to invitation interface

## 0.10.13

### Patch Changes

- 9f812e6: Removes the invitations service and updates existing invitations

## 0.10.12

### Patch Changes

- 59e8853: This updates journals and adds clients telemetry

## 0.10.11

### Patch Changes

- 9ec65e6: update re api method type

## 0.10.10

### Patch Changes

- cbdedb9: This fixes the value param in messages page metadata

## 0.10.9

### Patch Changes

- ffa578a: Update the content of the schedule for the rules engine

## 0.10.8

### Patch Changes

- 574f32b: add list entity users

## 0.10.7

### Patch Changes

- e48f976: add role and actions to domain struct

## 0.10.6

### Patch Changes

- 6773559: update connection type naming

## 0.10.5

### Patch Changes

- 188e93e: Add channel level role management

## 0.10.4

### Patch Changes

- 29b932d: update sending message

## 0.10.3

### Patch Changes

- 4571aab: update entity structs to include permissions

## 0.10.2

### Patch Changes

- 9de0997: update page metadata

## 0.10.1

### Patch Changes

- e2bc996: add metadata to Rule interface

## 0.10.0

### Minor Changes

- c269644: add rules service to the sdk

## 0.9.12

### Patch Changes

- 45dee3f: updates the roles to use roleId instead of roleName in the URL

## 0.9.11

### Patch Changes

- dd7837d: updates the group struct to include actions and roles

## 0.9.10

### Patch Changes

- 765e90a: Update role responses to return string arrays instead of an object containing string arrays

## 0.9.9

### Patch Changes

- 3d97973: This pr updates the users service to the latest jsdocs and also removes the need for passing a user to enable or disable the user.

## 0.9.8

### Patch Changes

- 7c6dcd1: rename things to clients

## 0.9.7

### Patch Changes

- 7b76ecf: update journal service to include domain id in entity journals and add a new endpoint for user journals

## 0.9.6

### Patch Changes

- b6cbc3c: updates the groups service with the new auth refactor

## 0.9.5

### Patch Changes

- c195860: Update clients service to match new auth

## 0.9.4

### Patch Changes

- 9fa7f26: update channels to match new access control

## 0.9.3

### Patch Changes

- cfe872c: add documentation and tests for domains. Also adds missing functions

## 0.9.2

### Patch Changes

- cdea55e: update linter

## 0.9.1

### Patch Changes

- 287856d: add actions and members to roles

## 0.9.0

### Minor Changes

- a975a8e: Update the sdk to use the new access control by introducing roles

## 0.8.3

### Patch Changes

- 8f198fc: Add domainId to read messages

## 0.8.2

### Patch Changes

- 45fff20: Remove domain id in invitations file

## 0.8.1

### Patch Changes

- 963294e: Add permissions to User's struct

## 0.8.0

### Minor Changes

- 9845a4b: return name to pageMetadata

## 0.7.0

### Minor Changes

- e754d29: update users client to match Magistrala with new fields and functions

### Patch Changes

- e754d29: update createToken example
- e754d29: rename password back to secret in credentials
- e754d29: modify issue token function to use identity instead of username

## 0.6.3

### Patch Changes

- 43a05d9: remove domains prefix from domain users url

## 0.6.2

### Patch Changes

- 66fb8a4: move host url from sdk param to specific function param. This enables flexibility of the UI to allow for multitenancy
- 66fb8a4: add documentation

## 0.6.1

### Patch Changes

- c4f60b9: remove domains endpoints
- c4f60b9: update things, channels, groups, bootstrap, certs api endpoints to have domain id

## 0.6.0

### Minor Changes

- ac1b256: add service health check functionality

## 0.5.1

### Patch Changes

- 6574165: update documentation
- 6574165: Update remove user from domain to remove the need for relation

## 0.5.0

### Minor Changes

- 9bd2134: Add search endpoint to users

## 0.4.3

### Patch Changes

- a2611c4: Add id and tree to metadata

## 0.4.2

### Patch Changes

- 143a2be: this changeupdates the return messages, updates the channels in the bootstrapconfig to a string[]

## 0.4.1

### Patch Changes

- 4551043: return limit to channelsPage

## 0.4.0

### Minor Changes

- ff9865e: This update adds a new service, Journal service. Journal service is used to fetch historical events for specific entities.

### Patch Changes

- 313a777: update how channels are returned

## 0.3.11

### Patch Changes

- d1573bd: Add delete user functionality to users class
