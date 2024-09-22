import { Request, Response } from 'express';
import { Injectable } from '@common/application/decorator';
import { RoutingValidatorService } from '@common/application/service';
import { createOrderInput } from '@order/application/controller/input';
import { HttpMethod } from '@common/domain/enum';
import { ICreateEntity } from '@common/application/interface';
import { OrderService } from '@order/application/service';
import { OrderIdFormat } from '@order/application/controller/format';

@Injectable()
export class OrdersController {
  public constructor (
    private readonly orderService: OrderService,
    private readonly orderIdFormat: OrderIdFormat,
    private readonly routingValidator: RoutingValidatorService,
  ) {
    this.routingValidator
      .register(HttpMethod.POST, '/orders', createOrderInput());
  }

  // change this process to events design
  public async postOrder (req: Request, response: Response): Promise<ICreateEntity> {
    const orderId = await this.orderService.createOrder(req.body, response.locals.session);

    return {
      data: this.orderIdFormat.format(orderId),
    };
  }
}
