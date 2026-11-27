/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { Equal, Expect } from './test-helpers';
import { initContract } from './dsl';
import {
  AreAllPropertiesOptional,
  Without,
  SchemaInputOrType,
  SchemaOutputOrType,
} from './type-utils';

const c = initContract();

/**
 * These pin the behaviour of `Schema{Output,Input}OrType` now that the deprecated
 * `T extends z.ZodTypeAny ? z.output<T>` arm is gone. It existed only for **zod 3** schemas, which predate
 * Standard Schema; a zod 4 schema exposes `~standard`, so it resolves through the `StandardSchemaV1` arm
 * and must infer exactly the same types it did before. `.transform()` is the case that would expose a
 * difference, since it is the one where input and output diverge.
 */
const zodObject = z.object({ title: z.string() });
type ZodObjectOutput = Expect<
  Equal<SchemaOutputOrType<typeof zodObject>, { title: string }>
>;
type ZodObjectInput = Expect<
  Equal<SchemaInputOrType<typeof zodObject>, { title: string }>
>;

const zodNullable = zodObject.nullable();
type ZodNullableOutput = Expect<
  Equal<SchemaOutputOrType<typeof zodNullable>, { title: string } | null>
>;

const zodTransformed = z.object({ count: z.string().transform(Number) });
type ZodTransformedOutput = Expect<
  Equal<SchemaOutputOrType<typeof zodTransformed>, { count: number }>
>;
type ZodTransformedInput = Expect<
  Equal<SchemaInputOrType<typeof zodTransformed>, { count: string }>
>;

const zodCoerced = z.coerce.number();
type ZodCoercedOutput = Expect<
  Equal<SchemaOutputOrType<typeof zodCoerced>, number>
>;

// A plain type is passed through untouched — it is not a schema.
type PlainPassThrough = Expect<
  Equal<SchemaOutputOrType<{ title: string }>, { title: string }>
>;

// The contract marker types resolve ahead of the schema arms.
type PlainContractType = Expect<
  Equal<
    SchemaOutputOrType<ReturnType<typeof c.type<{ title: string }>>>,
    { title: string }
  >
>;
type NullContractType = Expect<
  Equal<SchemaOutputOrType<ReturnType<typeof c.type<null>>>, null>
>;
type NoBodyContractType = Expect<
  Equal<SchemaOutputOrType<ReturnType<typeof c.noBody>>, undefined>
>;

type AreAllPropertiesOptional1 = Expect<
  Equal<AreAllPropertiesOptional<{ a: string; b?: string }>, false>
>;

type AreAllPropertiesOptional2 = Expect<
  Equal<AreAllPropertiesOptional<{ a?: string; b?: string }>, true>
>;

type AreAllPropertiesOptional3 = Expect<
  Equal<
    AreAllPropertiesOptional<{
      params: {
        id: string;
      };
      headers?: Record<string, string>;
    }>,
    false
  >
>;

type WithoutTest = Expect<
  Equal<
    Without<
      {
        body: never;
        params: {
          id: string;
        };
        headers?: Record<string, string>;
      },
      never
    >,
    {
      params: {
        id: string;
      };
      headers?: Record<string, string>;
    }
  >
>;

/**
 * The assertions in this file are type-level: they fail the build, not the runner. This keeps jest from
 * reporting the file as empty (and replaces the `it.todo('should infer type')` that stood in for the
 * unasserted `SchemaOutputOrType` types above).
 */
it('infers schema types at compile time', () => {
  expect(zodObject.parse({ title: 'a' })).toEqual({ title: 'a' });
  expect(zodTransformed.parse({ count: '2' })).toEqual({ count: 2 });
});
