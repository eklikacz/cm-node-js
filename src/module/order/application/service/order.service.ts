import { Injectable } from '@common/application/decorator';
import { CommandBusService } from '@common/application/service/cqrs';
import { v7 } from 'uuid';
import { ProductService } from '@product/application/service';
import { CreateOrderCommand } from '@order/domain/cqrs/command';
import { ConflictError } from '@common/domain/error/rest';
import mongoose from 'mongoose';

interface ICreateOrderBody {
  customerId: string,
  products: Array<{
    id: string,
    count: number,
    price: string,
  }>,
}

@Injectable()
export class OrderService {
  public constructor (
    private readonly commandBus: CommandBusService,
    private readonly productService: ProductService,
  ) {
  }

  public async createOrder (body: ICreateOrderBody, session: mongoose.ClientSession): Promise<string> {
    const id = v7();

    const items: ICreateOrderBody['products'] = [];
    let orderedCount = 0;

    for (const product of body.products) {
      await this.productService.getProduct(product.id, session);
      await this.productService.decrementProductStock(product.id, product.count, session);

      orderedCount += product.count;
      items.push(product);
    }

    await this.commandBus.execute<CreateOrderCommand>(new CreateOrderCommand(id, body.customerId, orderedCount, items), session)
      .catch((err) => {
        throw new ConflictError(err.message, 'Conflict');
      });

    return id;
  }
}
