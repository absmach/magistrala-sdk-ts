---
"@absmach/magistrala-sdk": patch
---

Fix Bootstrap module endpoint paths to use `devices/...` instead of the stale `clients/...` prefix.

The bootstrap service's HTTP routes were renamed from `clients/...` to
`devices/...` as part of the Client-to-Device rename (this was called out as
deliberately deferred in the prior rename changeset, since the backend still
expected `clients/...` at the time). The backend has since caught up, so
`Bootstrap.list`, `.add`, `.get`, `.update`, `.remove`, `.updateCerts`,
`.createProfile`, `.listProfiles`, `.viewProfile`, `.updateProfile`,
`.deleteProfile`, `.uploadProfile`, `.renderPreview`, `.profileSlots`,
`.assignProfile`, `.bindResources`, `.listBindings`, and
`.refreshBindings` were all requesting routes that no longer exist,
404ing with a plain-text body that broke JSON parsing of the response.
