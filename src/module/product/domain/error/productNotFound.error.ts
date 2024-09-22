import { InfrastructureError } from '@common/domain/error';

export class ProductNotFoundError extends InfrastructureError {
  public code: string = 'ProductNotFoundError';
  public defaultMessage: string = 'Product not found!';
}
