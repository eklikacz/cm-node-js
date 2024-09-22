import { AbstractCommandHandler, ICommandHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { IncrementProductStockCommand } from '@product/domain/cqrs/command';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class IncrementProductStockHandler extends AbstractCommandHandler implements ICommandHandler<IncrementProductStockCommand> {
  public constructor (
    private readonly repository: ProductRepository,
  ) {
    super();
  }

  public async execute (body: IncrementProductStockCommand): Promise<void> {
    await this.repository.changeProductStock({
      id: body.id,
      incrementStock: body.count,
    });
  }
}
