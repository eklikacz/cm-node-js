import { Injectable } from '@common/application/decorator';
import { IProductSchema } from '@product/domain/schema';

export interface IProduct {
    id: string,
    name: string,
    description: string,
    price: string,
    stock: number,
    createdAt: string,
    updatedAt?: string,
    deletedAt?: string,
}

@Injectable()
export class ProductFormat {
  public formatProduct (entity: IProductSchema) : IProduct {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : undefined,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : undefined,
    };
  }
}
