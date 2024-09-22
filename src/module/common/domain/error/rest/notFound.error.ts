import { RestError } from './rest.error';
import { SubRestError } from './subRest.error';
import { StatusCodes } from 'http-status-codes';

export class NotFoundError extends RestError {
  public constructor (message: string, code?: string) {
    super([new SubRestError(message, code ?? 'NotFoundError')], StatusCodes.NOT_FOUND);
  }
}
