import { EnvService, Logger } from '@common/application/service';
import {
  createErrorHandlerMiddleware,
  requestTimeMiddleware,
} from '@common/application/middleware';
import express, { Express } from 'express';
import { initModules } from '@/module/init.module';

export const setup = async (logger: Logger): Promise<Express> => {
  const app = express();
  const port = EnvService.getEnv('APPLICATION_PORT', 3000);
  const isDebug = EnvService.getEnv('IS_DEBUG', false) as boolean;

  // @ToDo prepare metrics ( ex. Prometheus )
  app.use(requestTimeMiddleware(logger));
  app.use(express.json());

  // pre run all modules
  await initModules(app);

  app.use(createErrorHandlerMiddleware(logger, isDebug));

  app.listen(port, () => logger.info('Start listening on port:' + port));

  return app;
};
