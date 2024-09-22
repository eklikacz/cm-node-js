import { IQuery } from '@common/application/service/cqrs';

export class CountAllProductsQuery implements IQuery {
  public constructor (
      public readonly filters: {
          name?: string,
      },
  ) {}
}
