import { Injectable } from '@common/application/decorator';
import { CommandBusService } from '@common/application/service/cqrs';
import { v7 } from 'uuid';
import { ProductService } from '@product/application/service';
import { CreateOrderCommand } from '@order/domain/cqrs/command';
import { ConflictError } from '@common/domain/error/rest';

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

  public async createOrder (body: ICreateOrderBody): Promise<string> {
    const id = v7();

    const items: ICreateOrderBody['products'] = [];
    let orderedCount = 0;

    for (const product of body.products) {
      await this.productService.getProduct(product.id);
      await this.productService.decrementProductStock(product.id, product.count);

      orderedCount += product.count;
      items.push(product);
    }

    await this.commandBus.execute<CreateOrderCommand>(new CreateOrderCommand(id, body.customerId, orderedCount, items))
      .catch((err) => {
        throw new ConflictError(err.message, 'Conflict');
      });

    return id;
  }
}
