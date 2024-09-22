export class CoreError extends Error {
  public code: string = '';
  public defaultMessage: string = '';

  public constructor (message?: string, code?: string) {
    super();

    this.message = message ?? this.defaultMessage;
    this.code = this.code || (code ?? '');
  }

  public static createCoreError (error: Error) {
    const err = new this(error.message, error.constructor.name);

    err.name = error.name;
    err.stack = error.stack;

    return err;
  }
}
