import { IQuery } from '@common/application/service/cqrs';

export class GetAllProductsQuery implements IQuery {
  public constructor (
      public readonly filters: {
          name?: string,
      },
      public readonly page: number,
      public readonly itemsPerPage: number,
      public readonly sortBy: string,
      public readonly sortDir: string,
  ) {}
}
