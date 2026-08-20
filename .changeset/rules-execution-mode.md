---
"@absmach/magistrala-sdk": minor
---

Add the Rules Engine execution mode.

`Script.mode` carries a rule's interpreter policy (`"sandboxed"` or
`"unrestricted"`). Omitting it on create means `unrestricted`, and omitting it on update
preserves the stored mode, so existing callers are unaffected.

`RulesPageMetadata.mode` filters a rules listing by that mode. Omitting it
returns rules in every mode. Unset query parameters are now dropped from the
rules listing request instead of being sent as the string `"undefined"`.
