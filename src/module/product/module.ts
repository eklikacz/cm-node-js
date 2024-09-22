import { Express } from 'express';
import { DependencyService, Logger, RoutingControllerService } from '@common/application/service';
import { ProductsController, ProductStockController } from '@product/application/controller';
import { StatusCodes } from 'http-status-codes';
import {
  CreateProductHandler,
  DecrementProductStockHandler,
  IncrementProductStockHandler,
} from '@product/infrastructure/cqrsHandler/command';
import { CqrsService } from '@common/application/service/cqrs';
import {
  CreateProductCommand,
  DecrementProductStockCommand,
  IncrementProductStockCommand,
} from '@product/domain/cqrs/command';
import {
  CountAllProductsHandler,
  GetAllProductsHandler,
  GetProductByIdHandler,
} from '@product/infrastructure/cqrsHandler/query';
import { CountProductStockQuery, GetAllProductsQuery } from '@product/domain/cqrs/query';
import { CountAllProductsQuery } from '@product/domain/cqrs/query/countAllProducts.query';
import { CountProductStockHandler } from '@product/infrastructure/cqrsHandler/query/countProductStock.handler';
import { GetProductByIdQuery } from '@product/domain/cqrs/query/getProductById.query';
import { HttpMethod } from '@common/domain/enum';
import { createValidatorMiddleware } from '@common/application/middleware';
import { createMongoDbTransactionMiddleware } from '@common/application/middleware/mongoDbTransaction.middleware';

export * as application from './application';
export * as domain from './domain';

export const init = async (app: Express) => {
  const dependency = DependencyService.instance();
  const productsController = dependency.resolve(ProductsController);
  const productStockController = dependency.resolve(ProductStockController);
  const mongoDbTransaction = await createMongoDbTransactionMiddleware(Logger.instance());

  dependency.resolve(CqrsService).registerCommandHandler(CreateProductCommand, dependency.resolve(CreateProductHandler))
    .registerCommandHandler(DecrementProductStockCommand, dependency.resolve(DecrementProductStockHandler))
    .registerCommandHandler(IncrementProductStockCommand, dependency.resolve(IncrementProductStockHandler))
    .registerQueryHandler(CountProductStockQuery, dependency.resolve(CountProductStockHandler))
    .registerQueryHandler(GetAllProductsQuery, dependency.resolve(GetAllProductsHandler))
    .registerQueryHandler(GetProductByIdQuery, dependency.resolve(GetProductByIdHandler))
    .registerQueryHandler(CountAllProductsQuery, dependency.resolve(CountAllProductsHandler));


  const validatorMiddleware = createValidatorMiddleware();

  app.use(...RoutingControllerService.createRouting(
    '/products',
    routing => routing
      .register('', HttpMethod.GET, productsController.getProducts.bind(productsController), StatusCodes.OK, [validatorMiddleware])
      .register('', HttpMethod.POST, productsController.postProduct.bind(productsController), StatusCodes.CREATED, [validatorMiddleware, mongoDbTransaction])
      .register('/:id/restock', HttpMethod.POST, productStockController.postProductRestock.bind(productStockController), StatusCodes.NO_CONTENT, [validatorMiddleware, mongoDbTransaction])
      .register('/:id/sell', HttpMethod.POST, productStockController.postProductSell.bind(productStockController), StatusCodes.NO_CONTENT, [validatorMiddleware, mongoDbTransaction]),
  ));
};
