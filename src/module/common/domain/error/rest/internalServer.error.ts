import { RestError } from './rest.error';
import { SubRestError } from './subRest.error';
import { StatusCodes } from 'http-status-codes';

export class InternalServerError extends RestError {
  public constructor (message: string, code?: string) {
    super([new SubRestError(message, code ?? 'InternalServerError')], StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
