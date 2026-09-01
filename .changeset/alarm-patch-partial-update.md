---
"@absmach/magistrala-sdk": minor
---

Change `Alarms.update` to a partial PATCH and stop accepting lifecycle attribution from callers.

`Alarms.update` now issues `PATCH` instead of `PUT` and takes the alarm id as
its own argument: `update(workspaceId, alarmId, update, token)` rather than
`update(workspaceId, alarm, token)`. Only the fields present in `update` are
changed; omitted fields are left untouched, and explicit zero values —
`status: "active"`, `severity: 0`, an empty `assignee_id`, an empty `metadata`
object — are applied rather than skipped.

The payload is the new `AlarmUpdate` type instead of a full `Alarm`. It carries
only what a client may set: `status`, `severity`, `assignee_id`, `acknowledged`
and `metadata`. Lifecycle attribution — `assigned_by`/`assigned_at`,
`acknowledged_by`/`acknowledged_at`, `resolved_by`/`resolved_at` — is no longer
part of the request. The service derives it from the authenticated caller and
the server clock, so sending it was never a reliable way to record who did what,
and the alarms service now rejects those fields outright.

Acknowledging an alarm is expressed as `{ acknowledged: true }` rather than by
writing `acknowledged_by` and `acknowledged_at` yourself; `{ acknowledged: false }`
clears the acknowledgement. Clearing an alarm is `{ status: "cleared" }`, which
records the caller as the resolver, and `{ status: "active" }` re-opens it and
clears the resolver. Assigning is `{ assignee_id: "<user-id>" }`, and an empty
string unassigns. `AlarmUpdate.status` excludes `"all"`, which is a list filter
rather than a storable state.

This requires an alarms service that serves `PATCH /{workspaceID}/alarms/{alarmID}`;
the deprecated `PUT` alias has been removed from the API.
