import { AbstractCommandHandler, ICommandHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { DecrementProductStockCommand } from '@product/domain/cqrs/command';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class DecrementProductStockHandler extends AbstractCommandHandler implements ICommandHandler<DecrementProductStockCommand> {
  public constructor (
    private readonly repository: ProductRepository,
  ) {
    super();
  }

  public async execute (body: DecrementProductStockCommand): Promise<void> {
    await this.repository.changeProductStock({
      id: body.id,
      decrementStock: body.count,
    });
  }
}
