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

Support the "Standard Schema" validation interface to enable support for Zod4, Valibot, Arktype etc.

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
