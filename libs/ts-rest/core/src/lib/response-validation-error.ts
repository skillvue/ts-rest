import { AppRoute } from './dsl';
import { StandardSchemaError } from './validation-error';

export class TsRestResponseValidationError extends Error {
  constructor(
    public appRoute: AppRoute,
    public cause: StandardSchemaError,
  ) {
    super(
      `[ts-rest] Response validation failed for ${appRoute.method} ${appRoute.path}: ${cause.message}`,
    );
  }
}

/**
 * Brand marking an error as a ts-rest request-validation error.
 *
 * Every server adapter has to extend the base class its framework expects — Nest needs
 * `BadRequestException` to produce a 400, serverless needs `TsRestHttpError` to carry a status code —
 * so they cannot all extend {@link TsRestRequestValidationError}. Instead they carry this brand, and
 * {@link TsRestRequestValidationError} recognises it via `Symbol.hasInstance`, so
 * `err instanceof TsRestRequestValidationError` holds for *every* adapter's error. This is the single
 * check consumers should write in their error handlers / exception filters.
 *
 * `Symbol.for` is deliberate: the brand survives having more than one copy of `@ts-rest/core` in the
 * dependency graph, where a plain `instanceof` would not.
 */
export const TsRestRequestValidationErrorBrand = Symbol.for(
  'ts-rest.RequestValidationError',
);

/**
 * The shape every adapter's request-validation error exposes.
 */
export interface TsRestRequestValidationErrorLike {
  pathParams: StandardSchemaError | null;
  headers: StandardSchemaError | null;
  query: StandardSchemaError | null;
  body: StandardSchemaError | null;
}

export const isTsRestRequestValidationError = (
  error: unknown,
): error is TsRestRequestValidationErrorLike =>
  typeof error === 'object' &&
  error !== null &&
  (error as Record<PropertyKey, unknown>)[TsRestRequestValidationErrorBrand] ===
    true;

export class TsRestRequestValidationError extends Error {
  readonly [TsRestRequestValidationErrorBrand] = true;

  /**
   * Makes `instanceof` brand-based rather than prototype-based — see
   * {@link TsRestRequestValidationErrorBrand}.
   */
  static [Symbol.hasInstance](error: unknown): boolean {
    return isTsRestRequestValidationError(error);
  }

  constructor(
    public pathParams: StandardSchemaError | null,
    public headers: StandardSchemaError | null,
    public query: StandardSchemaError | null,
    public body: StandardSchemaError | null,
  ) {
    super('[ts-rest] request validation failed');
  }
}
