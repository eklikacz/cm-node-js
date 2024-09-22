import { CoreError } from '@common/domain/error';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { SubRestError } from './subRest.error';

export interface ISubRestError {}

export class RestError extends CoreError {
  public code: string;
  public status: StatusCodes;
  public errors: ISubRestError[];

  public constructor (errors: SubRestError[], status: StatusCodes) {
    const message = getReasonPhrase(status);

    super(message);

    this.code = message.toLowerCase().replace(/\s+/g, '-');
    this.status = status;
    this.errors = errors;
  }

  public static createCoreError (error: Error) {
    const err = new RestError([new SubRestError(error, error.name)], StatusCodes.INTERNAL_SERVER_ERROR);

    err.name = error.name;
    err.stack = error.stack;

    return err;
  }
}
