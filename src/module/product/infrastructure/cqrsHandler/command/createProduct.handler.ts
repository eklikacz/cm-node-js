import { ICommandHandler } from '@common/application/service/cqrs';
import { ProductRepository } from '@product/infrastructure/repository';
import { CreateProductCommand } from '@product/domain/cqrs/command';
import { Injectable } from '@common/application/decorator';

@Injectable()
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  public constructor (
    private readonly repository: ProductRepository,
  ) {
  }

  public async execute (body: CreateProductCommand): Promise<void> {
    const product = new this.repository.model({
      ...body,
      createdAt: new Date(),
    });

    await this.repository.create(product);
  }
}
