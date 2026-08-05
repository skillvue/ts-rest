import {
  StandardSchemaError,
  TsRestRequestValidationErrorBrand,
} from '@ts-rest/core';

/**
 * Carries {@link TsRestRequestValidationErrorBrand} so that
 * `err instanceof TsRestRequestValidationError` (from `@ts-rest/core`) also holds for this
 * express-specific class — see the brand's documentation in `@ts-rest/core`.
 */
export class RequestValidationError extends Error {
  readonly [TsRestRequestValidationErrorBrand] = true;

  constructor(
    public pathParams: StandardSchemaError | null,
    public headers: StandardSchemaError | null,
    public query: StandardSchemaError | null,
    public body: StandardSchemaError | null,
  ) {
    super('[ts-rest] request validation failed');
  }
}
