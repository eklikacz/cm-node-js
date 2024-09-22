import { CoreError } from '@common/domain/error';
import { ISubRestError } from './rest.error';

export class SubRestError extends CoreError implements ISubRestError {
  public code: string;

  public constructor (errorOrMessage: string | Error, code: string = 'SubRestError') {
    super(typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage.message);

    this.code = code;
  }
}
