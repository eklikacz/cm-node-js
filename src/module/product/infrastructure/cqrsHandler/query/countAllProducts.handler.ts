import { AbstractQueryHandler, IQueryHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { CountAllProductsQuery } from '@product/domain/cqrs/query';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class CountAllProductsHandler extends AbstractQueryHandler implements IQueryHandler<CountAllProductsQuery, number> {
  public constructor (
    private readonly repository: ProductRepository,
  ) {
    super();
  }

  public async execute (params: CountAllProductsQuery): Promise<any> {
    return this.repository.countProducts(params.filters, { session: this.session });

  }
}
