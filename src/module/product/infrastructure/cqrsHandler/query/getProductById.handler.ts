import { IQueryHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { IProductSchema } from '@product/domain/schema';
import { GetProductByIdQuery } from '@product/domain/cqrs/query/getProductById.query';
import { InfrastructureError } from '@common/domain/error';
import { ProductNotFoundError } from '@product/domain/error';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery, IProductSchema>{
  public constructor (
      private readonly repository: ProductRepository,
  ) {}

  public async execute (params: GetProductByIdQuery): Promise<IProductSchema> {
    return this.repository.findOne('id', params.id).catch((err: Error) => {
      if (err instanceof InfrastructureError) {
        throw new ProductNotFoundError();
      }

      throw InfrastructureError.createCoreError(err);
    });
  }
}
