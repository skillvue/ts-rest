# @ts-rest/react-query-v5

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

### Minor Changes

- 5cde6d9: add react 19 as peer dependency

## 3.51.1

## 3.51.0

## 3.50.0

## 3.49.4

## 3.49.3

## 3.49.2

## 3.49.1

## 3.49.0

## 3.49.0
