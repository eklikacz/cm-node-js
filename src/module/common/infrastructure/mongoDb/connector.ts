import { connect, Mongoose } from 'mongoose';
import { Logger } from '@common/application/service';

export interface ConfigConnectionToMongoDB {
  connectionString: string,
}

export const connectToMongoose = (
  config: ConfigConnectionToMongoDB,
  logger: Logger,
): Promise<Mongoose> => {
  return connect(
    config.connectionString,
    {
      ignoreUndefined: true,
    },
  ).then(mongoose => {
    logger.debug('Connected to MongoDB', { host: mongoose.connection.host, port: mongoose.connection.port });

    return mongoose;
  });
};
