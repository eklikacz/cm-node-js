import { Express } from 'express';
import * as CommonModule from '@common/module';
import * as ProductModule from '@product/module';
import * as OrderModule from '@order/module';
import { Logger } from '@common/application/service';

export const initModules = async (express: Express, logger: Logger) => {
  await CommonModule.init(express, logger);
  await Promise.all([
    ProductModule.init(express, logger),
    OrderModule.init(express, logger),
  ]);
};
