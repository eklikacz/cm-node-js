import { ICommand } from '@common/application/service/cqrs';

export class CreateProductCommand implements ICommand {
  public constructor (
      public readonly id: string,
      public readonly name: string,
      public readonly description: string,
      public readonly price: string,
      public readonly stock: number,
  ) {
  }
}
