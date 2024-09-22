import 'reflect-metadata';
import 'module-alias';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Logger } from '@common/application/service';
import { setup } from '@/setup';
import { MockedLoggerService } from './mocked/mockedLogger.service';
import { Express } from 'express';
import request from 'supertest';
import * as faker from 'faker';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryReplSetStates } from 'mongodb-memory-server-core/lib/MongoMemoryReplSet';

export const mongoServer: MongoMemoryReplSet = new MongoMemoryReplSet({
  replSet: { dbName: 'mydatabase', name: 'rs0', count: 3 },
  instanceOpts: [
    { port: faker.datatype.number({ min: 25000, max: 26000 }) },
    { port: faker.datatype.number({ min: 25000, max: 26000 }) },
    { port: faker.datatype.number({ min: 25000, max: 26000 }) },
  ],
});
export let logger: Logger;
let server: any;
let app: Express;

async function bootstrap () {
  logger = new MockedLoggerService();
  mongoServer.state !== MongoMemoryReplSetStates.running && await mongoServer.start();

  prepareEnvs(mongoServer.getUri('mydatabase'));

  const result = await setup(logger);
  app = result.app;
  server = result.server;
}

beforeAll(async () => {
  await bootstrap();
});

afterAll(async () => {
  console.warn = jest.fn();
  await mongoServer.stop({ force: true });
  await server.close();
});

export async function getApi (): Promise<TestAgent> {
  return new Promise(resolve => {
    const randomNumber = getRandomNumber();
    const intervalId = setInterval(() => {
      if (app) {
        clearInterval(intervalId);

        return resolve(request(app));
      }
    }, randomNumber);
  });
}

function getRandomNumber (min: number = 100, max: number = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prepareEnvs (mongoConnectionString: string) {
  process.env.IS_DEBUG = 'true';
  process.env.APPLICATION_PORT = faker.datatype.number({ min: 4000, max: 5000 }).toFixed();
  process.env.APPLICATION_CONFIG_PATH = 'specs/schema/rest-application-config.yaml';
  process.env.MONGO_DB_CONNECTION_STRING = mongoConnectionString;
}
