---
'@skillvue/ts-rest-open-api': major
---

Add support for custom schema transformers to work with standard schema update in 3.53.0

**Breaking: `schemaTransformer` is now required.** A validator-agnostic generator cannot know how to turn
your schemas into JSON Schema, so `generateOpenApi` / `generateOpenApiAsync` take a mandatory third
`options` argument carrying it. There is no default.

Do **not** reach for `@anatine/zod-openapi` — it is a Zod 3 library and throws on Zod 4 schemas. For Zod 4,
wrap zod's own `z.toJSONSchema(schema, { target: 'openapi-3.0' })`; the migration guide has a
copy-pasteable transformer.

Header parameters are also now derived from the per-header record DSL rather than one merged object schema,
so regenerate your document and diff it rather than assuming it is unchanged.
