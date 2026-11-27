import {
  AppRoute,
  isStandardSchema,
  StandardSchemaV1,
} from '@skillvue/ts-rest-core';
import {
  AsyncAndSyncHelper,
  GetAsyncFunction,
  GetSyncFunction,
  SchemaTransformerAsync,
  SchemaTransformerSync,
} from '../types';
import { ParameterObject, SchemaObject } from 'openapi3-ts';
import { schemaObjectToParameters, schemaToParameter } from './utils';

type GetHeaderParameterHelper = AsyncAndSyncHelper<
  {
    appRoute: AppRoute;
    id: string;
    concatenatedPath: string;
  },
  {
    transformSchema: SchemaTransformerSync;
  },
  {
    transformSchema: SchemaTransformerAsync;
  },
  Array<ParameterObject>
>;

/**
 * Turn one entry of the record-style `headers` DSL into a Parameter Object.
 *
 * A per-header schema is a scalar (`z.string()`), not an object, so `schemaObjectToParameters` — which
 * only walks `type: 'object'` properties — returns nothing for it and the header vanishes from the
 * generated document. The header name comes from the record key, and "required" is decided by asking the
 * schema whether it accepts `undefined`.
 */
const subSchemaToHeaderParameter = (
  transformedSchema: SchemaObject,
  subSchema: StandardSchemaV1,
  key: string,
): ParameterObject => {
  const validateEmptyResult = subSchema['~standard'].validate(undefined);

  if (validateEmptyResult instanceof Promise) {
    throw new Error('Schema validation must be synchronous');
  }

  const isRequired = Boolean(validateEmptyResult.issues?.length);

  return schemaToParameter(transformedSchema, 'header', isRequired, key, false);
};

const syncFunc: GetSyncFunction<GetHeaderParameterHelper> = ({
  transformSchema,
  appRoute,
  id,
  concatenatedPath,
}) => {
  const schema = appRoute.headers;

  if (schema === null) {
    return [];
  }

  if (schema === undefined) {
    return [];
  }

  if (typeof schema === 'symbol') {
    return [];
  }

  if (isStandardSchema(schema)) {
    const transformedSchema = transformSchema({
      schema,
      appRoute,
      id,
      concatenatedPath,
      type: 'header',
    });

    if (!transformedSchema) {
      return [];
    }

    return schemaObjectToParameters(transformedSchema, 'header');
  }

  const parameters: ParameterObject[] = [];

  for (const [key, subSchema] of Object.entries(schema)) {
    if (isStandardSchema(subSchema)) {
      const transformedSchema = transformSchema({
        schema: subSchema,
        appRoute,
        id,
        concatenatedPath,
        type: 'header',
      });

      if (!transformedSchema) {
        continue;
      }

      parameters.push(
        subSchemaToHeaderParameter(transformedSchema, subSchema, key),
      );
    }
  }

  return parameters;
};

const asyncFunc: GetAsyncFunction<GetHeaderParameterHelper> = async ({
  transformSchema,
  appRoute,
  id,
  concatenatedPath,
}) => {
  const schema = appRoute.headers;

  if (schema === null) {
    return [];
  }

  if (schema === undefined) {
    return [];
  }

  if (typeof schema === 'symbol') {
    return [];
  }

  if (isStandardSchema(schema)) {
    const transformedSchema = await transformSchema({
      schema,
      appRoute,
      id,
      concatenatedPath,
      type: 'header',
    });

    if (!transformedSchema) {
      return [];
    }

    return schemaObjectToParameters(transformedSchema, 'header');
  }

  const parameters: ParameterObject[] = [];

  for (const [key, subSchema] of Object.entries(schema)) {
    if (isStandardSchema(subSchema)) {
      const transformedSchema = await transformSchema({
        schema: subSchema,
        appRoute,
        id,
        concatenatedPath,
        type: 'header',
      });

      if (!transformedSchema) {
        continue;
      }

      parameters.push(
        subSchemaToHeaderParameter(transformedSchema, subSchema, key),
      );
    }
  }

  return parameters;
};

export const getHeaderParameterSchema: GetHeaderParameterHelper = {
  sync: syncFunc,
  async: asyncFunc,
};
