import { RestError } from './rest.error';
import { SubRestError } from './subRest.error';
import { StatusCodes } from 'http-status-codes';

export class BadRequestError extends RestError {
  public constructor (message: string, code?: string) {
    super(
      [new SubRestError(message, code ?? 'BadRequestError')],
      StatusCodes.BAD_REQUEST,
    );
  }
}
