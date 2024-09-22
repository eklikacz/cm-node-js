import { ICommand } from '@common/application/service/cqrs';

export class CreateOrderCommand implements ICommand {
  public constructor (
    public readonly id: string,
    public readonly customerId: string,
    public readonly orderedCount: number,
    public readonly items: Array<{
      id: string,
      count: number,
      price: string,
    }>,
  ) {
  }
}
