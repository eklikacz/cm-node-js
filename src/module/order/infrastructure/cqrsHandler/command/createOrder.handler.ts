import { ICommandHandler } from '@common/application/service/cqrs';
import { Injectable } from '@common/application/decorator';
import { CreateOrderCommand } from '@order/domain/cqrs/command';
import { OrderRepository } from '@order/infrastructure/repository';
import { IOrderItem } from '@order/domain/schema';

@Injectable()
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  public constructor (
    private readonly repository: OrderRepository,
  ) {
  }

  public async execute (body: CreateOrderCommand): Promise<void> {
    const product = new this.repository.model({
      id: body.id,
      customerId: body.customerId,
      orderedCount: body.orderedCount,
      items: body.items.map<IOrderItem>(item => ({
        id: item.id,
        orderedCount: item.count,
        price: item.price,
      } as IOrderItem)),
      createdAt: new Date(),
    });

    await this.repository.create(product);
  }
}
