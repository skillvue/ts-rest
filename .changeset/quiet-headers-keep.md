---
'@skillvue/ts-rest-core': patch
---

Fix `ServerInferRequest` header types for branded schemas: header values are no longer passed through `LowercaseKeys`, which turned `string & BRAND<...>` into a mapped `String` object.
