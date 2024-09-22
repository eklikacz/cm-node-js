import { NextFunction, Request, Response } from 'express';
import { Logger } from '@common/application/service';

export const requestTimeMiddleware = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const timeInMs = diff[0] * 1000 + diff[1] / 1e6;

      logger.request(req, res, { during: timeInMs.toFixed() });
    });

    next();
  };
};
