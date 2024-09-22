import { ICommandHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { CreateProductCommand, DecrementProductStockCommand } from '@product/domain/cqrs/command';
import { v7 } from 'uuid';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class DecrementProductStockHandler implements ICommandHandler<DecrementProductStockCommand>{
  public constructor (
        private readonly repository: ProductRepository,
  ) {}

  public async execute (body: DecrementProductStockCommand): Promise<void> {
    await this.repository.changeProductStock({
      id: body.id,
      decrementStock: body.count,
    });
  }
}
