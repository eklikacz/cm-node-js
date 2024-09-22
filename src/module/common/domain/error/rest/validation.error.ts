import { SubRestError } from '@common/domain/error/rest/subRest.error';

export class ValidationError extends SubRestError {
  public code: string = 'ValidationError';

  public constructor (message: string) {
    super(message);
  }
}
