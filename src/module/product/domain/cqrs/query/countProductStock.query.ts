import { IQuery } from '@common/application/service/cqrs';

export class CountProductStockQuery implements IQuery {
  public constructor (
      public readonly id: string,
  ) {}
}
