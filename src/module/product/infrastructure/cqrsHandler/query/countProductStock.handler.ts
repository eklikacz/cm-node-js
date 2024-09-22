import { IQueryHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { CountProductStockQuery } from '@product/domain/cqrs/query';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class CountProductStockHandler implements IQueryHandler<CountProductStockQuery, number>{
  public constructor (
      private readonly repository: ProductRepository,
  ) {}

  public async execute (params: CountProductStockQuery): Promise<number> {
    return this.repository.countProducts(params);
  }
}
