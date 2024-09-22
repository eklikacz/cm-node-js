import { ICommand } from '@common/application/service/cqrs';

export class DecrementProductStockCommand implements ICommand {
  public constructor (
      public readonly id: string,
      public readonly count: number,
  ) {}
}
