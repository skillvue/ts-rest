import {
  isTsRestRequestValidationError,
  TsRestRequestValidationError,
  TsRestRequestValidationErrorBrand,
} from './response-validation-error';
import { StandardSchemaError } from './validation-error';

const issue = { message: 'invalid' };

describe('TsRestRequestValidationError', () => {
  it('is recognised by instanceof', () => {
    const error = new TsRestRequestValidationError(
      null,
      null,
      null,
      new StandardSchemaError([issue]),
    );

    expect(error instanceof TsRestRequestValidationError).toBe(true);
    expect(isTsRestRequestValidationError(error)).toBe(true);
  });

  /**
   * The reason the brand exists: adapters must extend their framework's base class
   * (BadRequestException, TsRestHttpError, …) and therefore cannot extend this one.
   */
  it('recognises an adapter error that carries the brand but does not extend it', () => {
    class SomeFrameworkException {
      constructor(public reason: string) {}
    }

    class AdapterRequestValidationError extends SomeFrameworkException {
      readonly [TsRestRequestValidationErrorBrand] = true;

      constructor(
        public pathParams: StandardSchemaError | null,
        public headers: StandardSchemaError | null,
        public query: StandardSchemaError | null,
        public body: StandardSchemaError | null,
      ) {
        super('request validation failed');
      }
    }

    const error = new AdapterRequestValidationError(
      null,
      null,
      null,
      new StandardSchemaError([issue]),
    );

    expect(error instanceof TsRestRequestValidationError).toBe(true);
    expect(isTsRestRequestValidationError(error)).toBe(true);
  });

  it('does not recognise unrelated errors', () => {
    expect(new Error('nope') instanceof TsRestRequestValidationError).toBe(
      false,
    );
    expect(isTsRestRequestValidationError(null)).toBe(false);
    expect(isTsRestRequestValidationError({})).toBe(false);
    expect(
      new StandardSchemaError([issue]) instanceof TsRestRequestValidationError,
    ).toBe(false);
  });
});
