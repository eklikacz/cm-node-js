import { AbstractRepository } from '@common/infrastructure/mongoDb';
import { Injectable } from '@common/application/decorator';
import { IOrderSchema, OrderSchema } from '@order/domain/schema';

@Injectable()
export class OrderRepository extends AbstractRepository<IOrderSchema> {
  public constructor () {
    super('Order', OrderSchema);
  }
}
