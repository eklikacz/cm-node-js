import { EnvService, Logger } from '@common/application/service';
import {
  createErrorHandlerMiddleware,
  requestTimeMiddleware,
} from '@common/application/middleware';
import express from 'express';
import { initModules } from '@/module/init.module';

export const setup = async (logger: Logger) => {
  const app = express();
  const port = EnvService.getEnv('APPLICATION_PORT', 3000);
  const isDebug = EnvService.getEnv('IS_DEBUG', 'false') === 'true';

  // @ToDo prepare metrics ( ex. Prometheus )
  app.use(requestTimeMiddleware(logger));
  app.use(express.json());

  // pre run all modules
  await initModules(app, logger);

  app.use(createErrorHandlerMiddleware(logger, isDebug));

  const server = await app.listen(port, () => logger.info('Start listening on port:' + port));

  return {
    app,
    server,
  };
};
