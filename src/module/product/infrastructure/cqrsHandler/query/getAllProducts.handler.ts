import { AbstractQueryHandler, IQueryHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { GetAllProductsQuery } from '@product/domain/cqrs/query';
import { IProductSchema } from '@product/domain/schema';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class GetAllProductsHandler extends AbstractQueryHandler implements IQueryHandler<GetAllProductsQuery, IProductSchema[]> {
  public constructor (
    private readonly repository: ProductRepository,
  ) {
    super();
  }

  public async execute (params: GetAllProductsQuery): Promise<IProductSchema[]> {
    return this.repository.findProducts(
      {
        name: params.filters.name,
        ...params,
      },
      { session: this.session },
    );
  }
}
