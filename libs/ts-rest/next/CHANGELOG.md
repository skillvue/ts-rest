# @ts-rest/next

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

- aefe6b3: Finish decoupling from zod: no `@ts-rest` package imports `zod` any more.

  v4 validates through Standard Schema, so nothing produced a `ZodError` and nothing needed zod's types —
  but four leftovers still made zod a compile-time dependency of the core packages:

  - `@skillvue/ts-rest-core` — `validateMultiSchemaObject` and `validateAgainstStandardSchema` declared
    `error?: StandardSchemaError | ZodError`. The `ZodError` arm was unreachable; both now return
    `StandardSchemaError`, and the casts it forced on every adapter are gone.
  - `@skillvue/ts-rest-core` — `SchemaOutputOrType` / `SchemaInputOrType` carried a `T extends z.ZodTypeAny` arm
    ahead of the Standard Schema arm, to keep inferring from **zod 3** schemas (which predate Standard
    Schema). zod 4 schemas expose `~standard`, so the arm was unreachable. **Breaking:** the deprecated
    `ZodInferOrType` / `ZodInputOrType` aliases are removed — use `SchemaOutputOrType` /
    `SchemaInputOrType`. Inference for zod 4 schemas is unchanged.
  - `@skillvue/ts-rest-next` — the deprecated `RequestValidationError`, whose four fields were typed `ZodError`, is
    removed as its own doc comment promised. **Breaking:** use `TsRestRequestValidationError`, which
    `@skillvue/ts-rest-next` re-exports and which carries `StandardSchemaError` fields.
  - `@skillvue/ts-rest-open-api` — dropped the `@anatine/zod-openapi` dependency (a **zod 3** library, unreferenced
    since the `schemaTransformer` design landed) and the `zod` peer dependency. zod now appears only in a
    spec-only file, excluded from the build. **Breaking** for anyone relying on zod arriving transitively.

  Note that `@skillvue/ts-rest-core` never declared zod as a dependency or peer dependency while importing it, so
  these imports resolved only by accident of the consumer's own dependency tree.

### Patch Changes

- 7e51c7a: Make `instanceof TsRestRequestValidationError` work in every server adapter.

  Each adapter has to extend a different framework base class, so none of them could extend the core error:
  nest threw a `BadRequestException` subclass, next declared its own identically-named class, and express
  threw `RequestValidationError`. A `@Catch()` filter or error handler checking the core class therefore saw
  `false` and fell through to a 500. The core class now recognises a `Symbol.for`-based brand that the
  adapters carry.

  Also fixes `@skillvue/ts-rest-serverless` answering `500 Server Error` instead of `400` for _every_ failed request
  validation: it threw core's plain-`Error` class, which its error handler maps to a 500.

- d4ee447: fix: nextjs query params polute reading path params

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

## 3.48.1

## 3.48.0

## 3.47.0

### Minor Changes

- eb2c647: Make sure initialized client and router types are exported so they can be re-exported with types emitted

## 3.46.0

### Minor Changes

- d763d45: Export `RequestValidationErrorSchema` for default request validation error responses.

## 3.45.2

## 3.45.1

### Patch Changes

- b56a97d: Fix type inference for `createSingleRouteHandler`

## 3.45.0

## 3.44.1

## 3.44.0

## 3.43.0

### Minor Changes

- 308b966: `TsRestResponseError` can be thrown from any server package

## 3.42.0

## 3.41.2

## 3.41.1

## 3.41.0

## 3.40.1

## 3.40.0

## 3.39.2

## 3.39.1

## 3.39.0

### Minor Changes

- 860e402: Add contract definition for an absent body and handle accordingly on the server

## 3.38.0

### Minor Changes

- 33d6a57: Add single route implementation helper

## 3.37.0

### Patch Changes

- 6a5280c: Deprecate initNextClient. Use `initClient` from @ts-rest/core and use the `fetchOptions.next` parameter.

## 3.36.0

### Minor Changes

- ab4dd27: Add support for creating single url routes in Next.js

## 3.35.1

## 3.35.0

## 3.34.0

## 3.33.1

## 3.33.0

## 3.32.0

## 3.31.0

### Minor Changes

- 3668247: feat: `@ts-rest/next` allow nextjs as a peer dependency
- cb7aa3d: feat: `ts-rest/next` allow customization for zod validation errors

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

## 3.30.1

## 3.30.0

## 3.29.0

### Patch Changes

- 5f7b236: - bump `@ts-rest/react-query` peer dependency `@tanstack/react-query` to `^4.0.0` (latest 4.33.0)
  - bump `@ts-rest/react-query` peer dependency `zod` to `^3.21.0`
  - upgrades NX to 16.7 for project root

## 3.28.0

### Minor Changes

- a7755ef: Adds support for fetch cache and support for Nextjs App Dir fetch, see this PR for more info: https://github.com/ts-rest/ts-rest/pull/315

## 3.27.0

### Patch Changes

- 55411ad: Upgrade zod to 3.21.4
  Upgrade @anatine/zod-openapi to 2.0.1

## 3.26.4

## 3.26.3

## 3.26.2

## 3.26.1

## 3.26.0

### Minor Changes

- fcf877d: Allow defining non-json response types in the contract

## 3.25.1

### Patch Changes

- 81560d4: Fix ESM/CJS issues in package.json

## 3.25.0

### Patch Changes

- bf21a75: Internal refactor of types

## 3.24.0

## 3.23.0

### Minor Changes

- 74bb4a8: Implement strict mode at a contract level. Strict mode ensures that only known responses are allowed by the type system. This applies both on the server and client side. Enable this with `strictStatusCodes: true` when defining a contract. If you would like to have the vanilla client throw an error when the response status is not known then you will need to use `throwOnUnknownStatus` when initializing the client.

## 3.22.0

## 3.21.2

## 3.21.1

### Patch Changes

- 1b4ef1e: Fix incorrect detection of zod objects with nested ZodEffects and fix regression with validation

## 3.21.0

### Patch Changes

- 8729bb5: Fix node16 esm module resolution

## 3.20.0

### Minor Changes

- c1c1d31: Add type-safe header definitions to contracts

## 3.19.5

## 3.19.4

## 3.19.3

## 3.19.2

### Patch Changes

- 96ab6bd: Revert ESM fix, due to failed compilation on Next.js

## 3.19.1

### Patch Changes

- ecac73d: Fix compatibility with Node.js TS native ESM code

## 3.19.0

## 3.18.1

## 3.18.0

## 3.17.0

## 3.16.2

## 3.16.1

## 3.16.0

### Minor Changes

- e490cf3: - Added server-side response validation feature
- Deprecated `@Api` decorator, use `@TsRest` instead

## 3.15.0

## 3.14.0

## 3.13.1

### Patch Changes

- d778e60: Rebuilt without code comments in the compiled JS

## 3.13.0

## 3.12.1

### Patch Changes

- e0164f6: Publish README

## 3.12.0

### Minor Changes

- 5a13803: Allow typed query parameters by encoding them as JSON strings (disabled by default)

## 3.11.2

## 3.11.1

## 3.11.0

## 3.10.2

## 3.10.1

## 3.10.0

### Patch Changes

- 35c64db: Move next lib utils out of @ts-rest/core to reduce bundle size

## 3.9.0

## 3.8.0

## 3.7.0

### Minor Changes

- 8a19717: Add pathParams transformations

## 3.6.1

## 3.6.0

### Minor Changes

- 6753c69: Build ESM and CommonJS for improved compatibility

## 3.5.0

## 3.4.2

## 3.4.1

## 3.4.0

## 3.3.0

## 3.2.2

## 3.2.1

## 3.2.0

## 3.1.1

## 3.1.0

### Minor Changes

- 1696c44: Provide access to req and res from Next.js adapter

## 3.0.0

### Major Changes

- 895112a: Migrate paths to a string rather than function

## 2.1.0

### Minor Changes

- 75f157a: Add Zod validation to @ts-rest/next
- a80cc0f: Add initial Next implementation, with a single endpoint based implementation
