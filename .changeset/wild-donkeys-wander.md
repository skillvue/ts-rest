---
'@skillvue/ts-rest-core': major
'@skillvue/ts-rest-next': major
'@skillvue/ts-rest-open-api': major
---

Finish decoupling from zod: no `@ts-rest` package imports `zod` any more.

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
