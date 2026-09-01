---
"@absmach/magistrala-sdk": patch
---

Fix Bootstrap module endpoint paths, and gracefully parse error responses that have no JSON body across every module.

- Bootstrap module endpoint paths used the stale `clients/...` prefix. The bootstrap service's HTTP routes were renamed to `devices/...` as part of the Client-to-Device rename (this was called out as deliberately deferred in the prior rename changeset, since the backend hadn't caught up yet - it has now), so `Bootstrap.list`, `.add`, `.get`, `.update`, `.remove`, `.updateCerts`, `.createProfile`, `.listProfiles`, `.viewProfile`, `.updateProfile`, `.deleteProfile`, `.uploadProfile`, `.renderPreview`, `.profileSlots`, `.assignProfile`, `.bindResources`, `.listBindings`, and `.refreshBindings` were all requesting routes that no longer exist, 404ing with a plain-text body that broke JSON parsing of the response.
- Every module called `response.json()` unconditionally on a failed request to read its error message. Not every non-2xx response carries a JSON body - an empty `500`, a proxy error page, a plain-text `404` (including the ones the path bug above used to cause) - so that parse could throw its own `SyntaxError` and hide the real failure behind a confusing "Unexpected end of JSON input". Added `Errors.ParseErrorMessage`, a reusable helper that falls back to the response's status text when the body is missing or isn't valid JSON, and used it in place of the unguarded `response.json()` calls in `Bootstrap`, `Certs`, `PATs`, `Messages`, `Journal`, `Alarms`, `Rules` (`re`), `Health`, `Roles`, and `Reports`.
