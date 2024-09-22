import { Logger } from '@common/application/service';
import { NextFunction, Request, Response } from 'express';
import { MongoClient } from '@common/module';

export async function createMongoDbTransactionMiddleware (logger: Logger) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const session = await MongoClient.startSession({});

    res.locals.session = session;
    res.locals.session.startTransaction();

    res.on('finish', async () => {
      if (res.statusCode >= 400) {
        await session.abortTransaction();
        logger.debug('Transaction aborted due to error: ' + res.statusCode);
      } else {
        await session.commitTransaction();
      }

      !session.hasEnded && await session.endSession();
    });

    next();
  };
}



