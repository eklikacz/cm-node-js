import { NextFunction, Request, Response } from 'express';
import { Logger } from '@common/application/service';
import { RestError } from '@common/domain/error/rest';

export const createErrorHandlerMiddleware = (logger: Logger, isDebug: boolean) => (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error: RestError = err instanceof RestError ? err : RestError.createCoreError(err);

  res.status(error.status ?? 500).json({
    status: error.code ?? 'internal-server-error',
    message: error.message ?? 'Internal Server Error',
    errors: isDebug ? (error.errors ?? []).map((err: any) => ({
      message: err.message,
      code: err.code,
    })) : [],
  });
  next();
};
