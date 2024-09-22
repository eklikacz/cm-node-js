import { AbstractRepository } from '@common/infrastructure/mongoDb';
import { IProductSchema, ProductSchema } from '@product/domain/schema';
import mongoose, { SortOrder } from 'mongoose';
import { MongoDbError } from '@common/domain/error';
import { Injectable } from '@common/application/decorator';

interface IFindProducts {
  id?: string,
  name?: string,
  page: number,
  itemsPerPage: number,
  sortBy: string,
  sortDir: string,
}

interface IChangeProductStock {
  id: string,
  incrementStock?: number,
  decrementStock?: number,
}

@Injectable()
export class ProductRepository extends AbstractRepository<IProductSchema> {
  public constructor () {
    super('Product', ProductSchema);
  }

  public async findProducts (dto: IFindProducts, options?: mongoose.QueryOptions<IProductSchema>): Promise<IProductSchema[]> {
    const filter = {
      ...(dto?.name ? { name: { $eq: dto.name } } : {}),
      ...(dto?.id ? { name: { $eq: dto.id } } : {}),
    };
    const skip = dto.itemsPerPage * (dto.page - 1);

    return this.collection
      .find(filter, undefined, { ...options })
      .limit(dto.itemsPerPage)
      .skip(skip >= 0 ? skip : 0)
      .sort([[dto.sortBy || 'createdAt', dto.sortDir as SortOrder || 'asc']])
      .exec();
  }

  public async countProducts (dto: Partial<IFindProducts>, options?: mongoose.MongooseBaseQueryOptions<IProductSchema>): Promise<number> {
    const filter = {
      ...(dto?.name ? { name: { $eq: dto.name } } : {}),
      ...(dto?.id ? { name: { $eq: dto.id } } : {}),
    };

    return this.collection.countDocuments(filter, { ...options }).exec();
  }

  public async changeProductStock (dto: IChangeProductStock, options?: mongoose.QueryOptions<IProductSchema>) {
    const update = {
      ...(typeof dto.incrementStock === 'number' ? { $inc: { stock: dto.incrementStock } } : {}),
      ...(typeof dto.decrementStock === 'number' ? { $inc: { stock: -dto.decrementStock } } : {}),
    };

    await this.collection.findOneAndUpdate({ id: dto.id }, update, {
      runValidators: true,
      new: true,
      returnDocument: 'after',
      ...options,
    })
      .exec()
      .then(async document => {
        if ((document?.stock ?? 0) < 0) {
          throw new Error('The product stock is below zero');
        }
      })
      .catch(error => {
        throw new MongoDbError(error);
      });
  }
}
