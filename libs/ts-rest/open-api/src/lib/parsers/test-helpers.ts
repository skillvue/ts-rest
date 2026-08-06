import { SchemaTransformerAsync, SchemaTransformerSync } from '../types';
import { isStandardSchema } from '@skillvue/ts-rest-core';
import { z } from 'zod';
import { toJsonSchema } from '@valibot/to-json-schema';
import { convert } from '@openapi-contrib/json-schema-to-openapi-schema';

/**
 * The zod transformer used to be `@anatine/zod-openapi`'s `generateSchema`, a **zod 3** library: given a
 * zod 4 schema (this repo pins zod 4) it reads `metaOpenApi` off an undefined object and throws, and
 * where it did not throw it dropped `.describe()` descriptions. Zod 4 generates JSON Schema itself, and
 * `target: 'openapi-3.0'` emits what openapi3-ts expects — so this is both the fix and the transformer
 * worth recommending to zod users.
 */
export const ZOD_SYNC: SchemaTransformerSync = ({ schema }) => {
  if (!isStandardSchema(schema) || schema['~standard'].vendor !== 'zod') {
    return null;
  }

  return z.toJSONSchema(schema as z.ZodType, {
    target: 'openapi-3.0',
    /**
     * `io` is deliberately uniform rather than `input` for requests and `output` for responses. The
     * Input/Output split would be more faithful, but zod emits a *different* JSON Schema per side
     * (`additionalProperties: false` on output, `{}` for a `.transform()`'s output), so one schema reused
     * as both a body and a response would produce two documents under one `title` and make `$ref`
     * extraction fail with "already exists with a different schema".
     */
    io: 'input',
    unrepresentable: 'any',
  }) as ReturnType<SchemaTransformerSync>;
};

export const ZOD_ASYNC: SchemaTransformerAsync = async (args) =>
  ZOD_SYNC(args as Parameters<SchemaTransformerSync>[0]);

export const VALIBOT_ASYNC: SchemaTransformerAsync = async ({ schema }) => {
  if (isStandardSchema(schema) && schema['~standard'].vendor === 'valibot') {
    const jsonSchema = toJsonSchema(schema as any, { errorMode: 'ignore' });
    return await convert(jsonSchema);
  }

  return null;
};
