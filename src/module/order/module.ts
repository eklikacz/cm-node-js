import { Express } from 'express';
import { DependencyService, Logger, RoutingControllerService } from '@common/application/service';
import { OrdersController } from '@order/application/controller';
import { StatusCodes } from 'http-status-codes';
import { HttpMethod } from '@common/domain/enum';
import { createValidatorMiddleware } from '@common/application/middleware';
import { createMongoDbTransactionMiddleware } from '@common/application/middleware/mongoDbTransaction.middleware';
import { CqrsService } from '@common/application/service/cqrs';
import { CreateOrderHandler } from '@order/infrastructure/cqrsHandler/command/createOrder.handler';
import { CreateOrderCommand } from '@order/domain/cqrs/command';

export * as application from './application';
export * as domain from './domain';
export * as infrastructure from './infrastructure';

export const init = async (app: Express) => {
  const dependency = DependencyService.instance();
  const orderController = dependency.resolve(OrdersController);
  const validatorMiddleware = createValidatorMiddleware();
  const mongoDbTransaction = await createMongoDbTransactionMiddleware(Logger.instance());

  dependency.resolve(CqrsService).registerCommandHandler(CreateOrderCommand, dependency.resolve(CreateOrderHandler));

  app.use(...RoutingControllerService.createRouting(
    '/orders',
    routing => routing
      .register('', HttpMethod.POST, orderController.postOrder.bind(orderController), StatusCodes.CREATED, [validatorMiddleware, mongoDbTransaction]),
  ));
};
