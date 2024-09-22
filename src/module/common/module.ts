import { Express } from 'express';
import { connectToMongoose } from '@common/infrastructure/mongoDb';
import { EnvService, Logger } from '@common/application/service';
import mongoose from 'mongoose';

export * as application from './application';
export * as domain from './domain';
export * as infrastructure from './infrastructure';

export let MongoClient: mongoose.Mongoose;
export const init = async (app: Express, logger: Logger) => {
  MongoClient = await connectToMongoose(
    { connectionString: EnvService.getEnv('MONGO_DB_CONNECTION_STRING', '') as string },
    logger,
  );
};
