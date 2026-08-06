---
'@skillvue/ts-rest-core': major
'@skillvue/ts-rest-express': major
'@skillvue/ts-rest-fastify': major
'@skillvue/ts-rest-nest': major
'@skillvue/ts-rest-next': major
'@skillvue/ts-rest-open-api': major
'@skillvue/ts-rest-react-query': major
'@skillvue/ts-rest-react-query-v5': major
'@skillvue/ts-rest-serverless': major
'@skillvue/ts-rest-solid-query': major
'@skillvue/ts-rest-vue-query': major
---

Publish under the `@skillvue` scope: every `@ts-rest/<name>` package is now `@skillvue/ts-rest-<name>`.

`4.0.0` ships from the skillvue fork, so the packages move with it. Subpath exports keep their suffix —
`@skillvue/ts-rest-serverless/aws`, `/azure`, `/fetch`, `/next`, and `@skillvue/ts-rest-react-query/v5`.

No exported symbol changes because of this: it is a scope change, not a rewrite. Uninstall the old
`@ts-rest/*` packages rather than leaving them installed — npm treats the two scopes as unrelated, so a
stale `@ts-rest/express` will happily resolve against the new core.

The version continues upstream's numbering on purpose, so `4.0` means the same thing in both projects and
the 3.x → 4.0 migration guide applies either way.
