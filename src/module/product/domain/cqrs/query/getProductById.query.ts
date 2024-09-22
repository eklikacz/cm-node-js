import { IQuery } from '@common/application/service/cqrs';

export class GetProductByIdQuery implements IQuery {
  public constructor (
      public readonly id: string,
  ) {}
}
