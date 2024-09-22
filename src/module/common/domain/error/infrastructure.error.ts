import { CoreError } from './core.error';

export class InfrastructureError extends CoreError {
  public code: string = 'InfrastructureError';
  public defaultMessage: string = 'An error has occurred';
}
