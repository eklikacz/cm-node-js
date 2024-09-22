import 'reflect-metadata';
import 'module-alias';
import { setup } from '@/setup';
import { Logger } from '@common/application/service';

const logger = Logger.instance();

setup(logger).catch((error) => logger.error(error));
