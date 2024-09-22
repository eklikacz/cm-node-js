import 'reflect-metadata';
import 'module-alias';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Logger } from '@common/application/service';
import { setup } from '@/setup';
import { MockedLoggerService } from './mocked/mockedLogger.service';
import { Express } from 'express';
import request from 'supertest';

export let mongoServer: MongoMemoryServer;
export let logger: Logger;
let app: Express;

beforeAll(async () => {
  logger = new MockedLoggerService();
  mongoServer = await MongoMemoryServer.create({});
  const uri = mongoServer.getUri('mydatabase');
  prepareEnvs(uri);

  app = await setup(logger);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

export function getApi () {
  return request(app);
}

function prepareEnvs (mongoConnectionString: string) {
  process.env.IS_DEBUG = 'false';
  process.env.APPLICATION_PORT = '3000';
  process.env.APPLICATION_CONFIG_PATH = 'specs/schema/rest-application-config.yaml';
  process.env.MONGO_DB_CONNECTION_STRING = 'mongodb://user:user123@localhost:27017/mydatabase?replicaSet=rs0';
}
