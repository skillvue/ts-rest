---
'@skillvue/ts-rest-open-api': patch
---

Fix two regressions that produced invalid or incomplete OpenAPI documents:

- `description` was missing from every Response Object. OpenAPI 3 requires it; it now falls back to the
  status code as before, and an explicit description on the response schema is used when present.
- `generateOpenApi` emitted no `header` parameters at all. Each per-header schema was fed to a helper that
  only walks object properties, so scalar header schemas produced nothing and the header name was dropped.
  `generateOpenApiAsync` was unaffected.
