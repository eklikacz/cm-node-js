import { CoreError } from '@common/domain/error/core.error';

export class ApplicationError extends CoreError {
  public code: string = 'ApplicationError';
  public defaultMessage: string = 'An error has occurred';
}
