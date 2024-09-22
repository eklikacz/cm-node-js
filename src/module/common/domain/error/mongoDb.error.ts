import { InfrastructureError } from './infrastructure.error';

export class MongoDbError extends InfrastructureError {
  public code: string = 'MongoDbError';
  public defaultMessage: string = 'An error has occurred';

  public constructor (error: any) {
    const code = error.name;
    let message = error.message;

    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        message += '|' + field + ':' + error.errors[field].message;
      }
    }

    super(message, code);
  }
}
