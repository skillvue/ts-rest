# @ts-rest/serverless

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

### Patch Changes

- 7e51c7a: Make `instanceof TsRestRequestValidationError` work in every server adapter.

  Each adapter has to extend a different framework base class, so none of them could extend the core error:
  nest threw a `BadRequestException` subclass, next declared its own identically-named class, and express
  threw `RequestValidationError`. A `@Catch()` filter or error handler checking the core class therefore saw
  `false` and fell through to a 500. The core class now recognises a `Symbol.for`-based brand that the
  adapters carry.

  Also fixes `@skillvue/ts-rest-serverless` answering `500 Server Error` instead of `400` for _every_ failed request
  validation: it threw core's plain-`Error` class, which its error handler maps to a 500.

- cda5966: Expose more types to fix build issues with "verbatimModuleSyntax" and other such build configs

## 3.52.1

## 3.52.0

## 3.51.1

## 3.51.0

### Minor Changes

- d4692e3: New `createFetchHandler` function added so a fetch handler can be initialized once and re-used

### Patch Changes

- 7cf4415: Fix AWS Lambda handler not working in Node.js environments.
- d4692e3: Fix response handling for itty-router >= 5.0.17

## 3.50.0

### Minor Changes

- e6af1db: Revert breaking change from v3.47.0. Order of generics on `tsr.router` and `tsr.route` have been reverted. `tsr.routerWithMiddleware` has been introduced so the contract does need to be passed twice.

## 3.49.4

## 3.49.3

## 3.49.2

### Patch Changes

- 6d7bea2: Fix broken package exports

## 3.49.1

### Patch Changes

- b31454f: All ts-rest libraries are now packaged in a better way to be compatible with as many bundlers as possible. The @tanstack/react-query `No QueryClient set` error should also occur much less now.

## 3.49.0

## 3.48.1

### Patch Changes

- Updated dependencies [f2835dd]
  - @ts-rest/core@3.48.1

## 3.48.0

### Patch Changes

- @ts-rest/core@3.48.0

## 3.47.0

### Minor Changes

- eb2c647: BREAKING CHANGE: The order of generics on the `tsr.*` methods have been swapped. Now you don't have to pass `typeof contract` first. You can now pass your request extension type only.
- eb2c647: Make sure initialized client and router types are exported so they can be re-exported with types emitted
- eb2c647: Fluent router builder for easier modification of request context type in middleware. Try it out through `tsr.routerBuilder(contract)`!

### Patch Changes

- @ts-rest/core@3.47.0

## 3.46.0

### Minor Changes

- d763d45: Export `RequestValidationErrorSchema` for default request validation error responses.
- 72fd14e: Add Azure Functions compatibility

### Patch Changes

- Updated dependencies [d763d45]
  - @ts-rest/core@3.46.0

## 3.45.2

### Patch Changes

- f5febbf: Change response handler type to accept promises
  - @ts-rest/core@3.45.2

## 3.45.1

### Patch Changes

- @ts-rest/core@3.45.1

## 3.45.0

### Patch Changes

- @ts-rest/core@3.45.0

## 3.44.1

### Patch Changes

- 08878f0: Create type helpers for route-level middleware context
  - @ts-rest/core@3.44.1

## 3.44.0

### Patch Changes

- Updated dependencies [60f90fa]
- Updated dependencies [45e5104]
  - @ts-rest/core@3.44.0

## 3.43.0

### Minor Changes

- 308b966: `TsRestResponseError` can be thrown from any server package
- 05e8a92: Add ability to include custom platform context for serverless fetch handler

### Patch Changes

- Updated dependencies [308b966]
  - @ts-rest/core@3.43.0

## 3.42.0

### Minor Changes

- 7108c19: Add middleware support

### Patch Changes

- Updated dependencies [7372bee]
  - @ts-rest/core@3.42.0

## 3.41.2

### Patch Changes

- b6bd2ed: Fix module resolution when not using node16 or nodenext
  - @ts-rest/core@3.41.2

## 3.41.1

### Patch Changes

- d107181: Fix broken type for `@ts-rest/serverless/next` handler
  - @ts-rest/core@3.41.1

## 3.41.0

### Patch Changes

- Updated dependencies [fc0adc6]
  - @ts-rest/core@3.41.0

## 3.40.1

### Patch Changes

- Updated dependencies [afa5066]
- Updated dependencies [afa5066]
  - @ts-rest/core@3.40.1

## 3.40.0

### Minor Changes

- fa7219d: Support Next.js App Router route handlers

### Patch Changes

- @ts-rest/core@3.40.0

## 3.39.2

### Patch Changes

- Updated dependencies [dc554da]
  - @ts-rest/core@3.39.2

## 3.39.1

### Patch Changes

- @ts-rest/core@3.39.1

## 3.39.0

### Minor Changes

- 860e402: Add contract definition for an absent body and handle accordingly on the server

### Patch Changes

- Updated dependencies [8f4cfe6]
- Updated dependencies [860e402]
- Updated dependencies [487b2b6]
  - @ts-rest/core@3.39.0

## 3.38.0

### Patch Changes

- Updated dependencies [0b9f249]
- Updated dependencies [15d4926]
  - @ts-rest/core@3.38.0

## 3.37.0

### Patch Changes

- Updated dependencies [6a5280c]
- Updated dependencies [77db06b]
  - @ts-rest/core@3.37.0

## 3.36.0

### Patch Changes

- Updated dependencies [c7e05d8]
  - @ts-rest/core@3.36.0

## 3.35.1

## 3.35.0

### Minor Changes

- bacc9d1: New serverless library for AWS Lambda, Edge runtimes and Next.js-specific Edge runtime

### Patch Changes

- @ts-rest/core@3.35.0
