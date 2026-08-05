import { StandardSchemaV1 } from './standard-schema';
import { StandardSchemaError } from './validation-error';
import { ContractAnyType } from './dsl';

/**
 * Type guard to check if the schema is a standard schema.
 *
 * @param schema - unknown
 * @returns boolean
 */
export const isStandardSchema = (
  schema: unknown,
): schema is StandardSchemaV1 => {
  if (!schema) {
    return false;
  }

  const standard = (schema as StandardSchemaV1)?.['~standard'];

  if (!standard) {
    return false;
  }

  return standard.version === 1 && typeof standard.validate === 'function';
};

/**
 * Takes in an unknown object and returns either a standard schema or null
 *
 * @param schema - unknown
 * @returns StandardSchemaV1<unknown, unknown> | null
 */
export const parseAsStandardSchema = (
  schema: unknown,
): StandardSchemaV1<unknown, unknown> | null => {
  const isStandard = isStandardSchema(schema);

  if (isStandard) {
    return schema;
  }

  return null;
};

/**
 * Since 3.53.0 we've moved to headers using an object with schemas inside it, rather than a top level schema.
 *
 * This makes it easier to merge schemas together.
 *
 * @param data - Data to validate e.g. headers
 * @param schemaObject - Schema object to validate against e.g. { 'x-foo': v.string() }
 * @returns
 */
export const validateMultiSchemaObject = (
  data: unknown,
  schemaObject: Record<string, ContractAnyType> | undefined,
): {
  value?: unknown;
  error?: StandardSchemaError;
  schemasUsed: Array<StandardSchemaV1<unknown, unknown>>;
} => {
  const schema = parseAsStandardSchema(schemaObject);

  // If the top level is not null we know it's a valid schema we can validate against
  if (schema !== null) {
    const result = validateAgainstStandardSchema(data, schema, {
      passThroughExtraKeys: true,
    });

    return {
      value: result.value,
      error: result.error,
      schemasUsed: [schema],
    };
  }

  const headersMap = new Map<string, unknown>(Object.entries(data ?? {}));

  const vendorSet = new Set<string>();
  const subSchemas = new Map<string, StandardSchemaV1<unknown, unknown>>();

  for (const [key, schema] of Object.entries(schemaObject ?? {})) {
    const parsedSchema = parseAsStandardSchema(schema);

    if (schema === null) {
      continue;
    }

    if (typeof schema === 'symbol') {
      continue;
    }

    if (parsedSchema !== null) {
      subSchemas.set(key, parsedSchema);
      vendorSet.add(parsedSchema['~standard'].vendor);
    } else {
      throw new Error(
        `Invalid schema provided for header ${key}, please use a valid schema`,
      );
    }
  }

  if (subSchemas.size === 0) {
    return {
      value: data,
      schemasUsed: [],
    };
  }

  const issues: StandardSchemaV1.Issue[] = [];

  for (const [key, schema] of subSchemas.entries()) {
    const value = headersMap.get(key);
    const result = validateAgainstStandardSchema(value, schema);

    if (result.error) {
      for (const issue of result.error.issues) {
        issues.push({
          ...issue,
          path: [key],
        });
      }
    } else {
      headersMap.set(key, result.value);
    }
  }

  if (issues.length > 0) {
    return {
      error: new StandardSchemaError(issues),
      schemasUsed: [...subSchemas.values()],
    };
  }

  return {
    value: Object.fromEntries(headersMap.entries()),
    schemasUsed: [...subSchemas.values()],
  };
};

/**
 * Merges the record-style `headers` of a router and one of its routes.
 *
 * Per-key replacement only: a route's entry replaces the base entry for that key, and there is no
 * implicit combining of two schemas for the same header — which is why this is a plain spread and why
 * `combineStandardSchemas` (dead since the record DSL landed) was removed.
 */
export const mergeHeaderSchemasForRoute = (
  baseSchema: unknown,
  routeSchema: unknown,
): unknown => {
  if (!baseSchema) {
    return routeSchema;
  }

  if (!routeSchema) {
    return baseSchema;
  }

  const mergedObjects = {
    ...baseSchema,
    ...routeSchema,
  };

  return mergedObjects;
};

/**
 * Similar to validateAgainstStandardSchema, but it takes an unknown schema, it will not validate if no schema provided and will check the schema is
 * valid before validating the data.
 *
 * This is super handy for validating request bodies, headers, etc. as it passes through the data if no schema is provided.
 */
export const validateIfSchema = (
  data: unknown,
  schema: unknown,
  {
    passThroughExtraKeys = false,
  }: {
    passThroughExtraKeys?: boolean;
  } = {},
): {
  value?: unknown;
  error?: StandardSchemaError;
  schemasUsed: Array<StandardSchemaV1<unknown, unknown>>;
} => {
  const schemaStandard = parseAsStandardSchema(schema);

  if (!schemaStandard) {
    return { value: data, schemasUsed: [] };
  }

  const result = validateAgainstStandardSchema(data, schemaStandard, {
    passThroughExtraKeys,
  });

  return {
    ...result,
    schemasUsed: [schemaStandard],
  };
};

export const validateAgainstStandardSchema = (
  data: unknown,
  schema: StandardSchemaV1<unknown, unknown>,
  {
    passThroughExtraKeys = false,
  }: {
    passThroughExtraKeys?: boolean;
  } = {},
): { value?: unknown; error?: StandardSchemaError } => {
  const result = schema['~standard'].validate(data);

  if (result instanceof Promise) {
    throw new Error('Schema validation must be synchronous');
  }

  if (result.issues) {
    return {
      error: new StandardSchemaError(result.issues),
    };
  }

  if (passThroughExtraKeys && typeof data === 'object' && result.value) {
    return {
      value: { ...data, ...result.value },
    };
  }

  return {
    value: result.value,
  };
};
