# @ts-rest/vue-query

## 4.0.0-rc.0

### Major Changes

- 8ca499f: Support the "Standard Schema" validation interface to enable support for Zod4, Valibot, Arktype etc.

  **This is breaking: Zod 3 is no longer supported.** Zod 3 predates Standard Schema, so it cannot be
  validated through the new interface, and `zod` was removed even as an optional peer dependency — add it to
  your own dependencies explicitly. Upgrade to Zod 4 (contract code is largely unchanged) or adopt Valibot /
  ArkType. Using no validator at all is now a supported configuration.

  Two further breaking consequences:

  - **The `headers` DSL is a record keyed by header name**, not one schema over the whole headers object:
    `headers: z.object({ 'x-foo': s })` becomes `headers: { 'x-foo': s }`, and likewise for `baseHeaders`.
    Merging is a plain spread with route precedence, a `null` value unsets an inherited header, and each
    header validates against its own schema so issues are re-keyed by header name.
  - **Request and response validation errors are `StandardSchemaError`, not `ZodError`** — a flat `.issues`
    array with no `.flatten()` / `.format()`, and `name === 'ValidationError'`. Anything asserting on a 400
    body from a server adapter, or catching a client-side response-validation error, must be updated. The
    Zod-shaped `*ErrorSchema` exports (`ZodErrorSchema`, `RequestValidationErrorSchema` and its variants,
    `DefaultRequestValidationErrorSchema`, `CombinedRequestValidationErrorSchema`) are removed with no
    replacement, as is the whole `zod-utils` surface (`checkZodSchema`, `isZodType`, `zodMerge`, …).

  Validation is synchronous: a schema that returns a Promise throws `Schema validation must be synchronous`.

  See the v4 migration guide for before/after code on each point.

- 2f00998: Publish under the `@skillvue` scope: every `@ts-rest/<name>` package is now `@skillvue/ts-rest-<name>`.

  `4.0.0` ships from the skillvue fork, so the packages move with it. Subpath exports keep their suffix —
  `@skillvue/ts-rest-serverless/aws`, `/azure`, `/fetch`, `/next`, and `@skillvue/ts-rest-react-query/v5`.

  No exported symbol changes because of this: it is a scope change, not a rewrite. Uninstall the old
  `@ts-rest/*` packages rather than leaving them installed — npm treats the two scopes as unrelated, so a
  stale `@ts-rest/express` will happily resolve against the new core.

  Each package's `repository` now points at `skillvue/ts-rest` rather than upstream, so the npm page links
  to the fork that actually built it — and so npm's provenance attestation matches the manifest.

  The version continues upstream's numbering on purpose, so `4.0` means the same thing in both projects and
  the 3.x → 4.0 migration guide applies either way.

## 3.52.1

## 3.52.0

## 3.51.1

## 3.51.0

## 3.50.0

## 3.49.4

## 3.49.3

## 3.49.2

## 3.49.1

### Patch Changes

- b31454f: All ts-rest libraries are now packaged in a better way to be compatible with as many bundlers as possible. The @tanstack/react-query `No QueryClient set` error should also occur much less now.

## 3.49.0

### Minor Changes

- 597cd92: You can now pass functions as values for your `baseHeaders` in your client. This makes it much easier now to fetch and set access tokens from your authentication libraries.

## 3.48.1

## 3.48.0

## 3.47.0

### Minor Changes

- eb2c647: Make sure initialized client and router types are exported so they can be re-exported with types emitted

## 3.46.0

## 3.45.2

## 3.45.1

## 3.45.0

## 3.44.1

## 3.44.0

## 3.43.0

## 3.42.0

## 3.41.2

## 3.41.1

## 3.41.0

### Patch Changes

- 5a48f18: Fix `select` option

## 3.40.1

## 3.40.0

## 3.39.2

## 3.39.1

## 3.39.0

## 3.38.0

## 3.37.0

### Minor Changes

- 6a5280c: Allow fetch options to be set and client options to be overridden per request

## 3.36.0

## 3.35.1

## 3.35.0

## 3.34.0

## 3.33.1

### Patch Changes

- 6d2c369: Remove TanStack Query v5 from peer dependencies

## 3.33.0

## 3.32.0

## 3.31.0

### Minor Changes

- 29fe85b: feat: `@ts-rest/react-query` use object-syntax in react-query to support [@tanstack/react-query@^5.0.0](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)

  - note: This does **not** implement a complete migration to v5 but lays the groundwork to get the ball rolling and apps running again.

  feat: `@ts-rest/vue-query` add @tanstack/vue-query@^5.0.0 as peer dependency

## 3.30.5

### Patch Changes

- 9bd7402: - `@ts-rest/fastify` fix: fastify deprecated routerPath property (fixes [#392](https://github.com/ts-rest/ts-rest/issues/392))
  - `@ts-rest/open-api` fix: Pass through contentType to OpenApi schema ([#414](https://github.com/ts-rest/ts-rest/pull/414))
  - `@ts-rest/core` fix: Content-type text/html returns blob body (fixes [#418](https://github.com/ts-rest/ts-rest/issues/418))
- 8cc95c5: add changeset for latest changes

## 3.30.4

### Patch Changes

- 10dff96: - fix: address `zod` [CVE](https://nvd.nist.gov/vuln/detail/CVE-2023-4316) with bump `@ts-rest` peer dependency `zod` to minimum `^3.22.3`
  - ref PR: https://github.com/colinhacks/zod/pull/2824

## 3.30.3

## 3.30.2

### Patch Changes

- bd0161b: fix: content-type application/json will not be automatically included in client request if the route is GET or body is undefined/null

## 3.30.1

## 3.30.0

## 3.29.0

### Minor Changes

- 2feedbb: Adds new `@ts-rest/vue-query` package!
  - feat: add support @tanstack/vue-query
  - feat: add docs for @tanstack/vue-query package
