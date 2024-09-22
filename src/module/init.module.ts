import { Express } from 'express';
import * as CommonModule from '@common/module';
import * as ProductModule from '@product/module';
import * as OrderModule from '@order/module';

export const initModules = async (express: Express) => {
  await CommonModule.init(express);
  await Promise.all([
    ProductModule.init(express),
    OrderModule.init(express),
  ]);
};
