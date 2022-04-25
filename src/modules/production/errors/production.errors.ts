import { ExceptionBase } from '@src/libs/exceptions';

export type ProductionError = ProductSpecNotFoundError;

export class ProductSpecNotFoundError extends ExceptionBase {
  static readonly message = 'Product spec not found';

  public readonly code = 'PRODUCTION.PRODUCT_SPEC_NOT_FOUND';

  constructor(metadata?: unknown) {
    super(ProductSpecNotFoundError.message, metadata);
  }
}
