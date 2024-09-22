import { CommandBusService, QueryBusService } from '@common/application/service/cqrs';
import { IProductSchema } from '@product/domain/schema';
import {
  CreateProductCommand,
  DecrementProductStockCommand,
  IncrementProductStockCommand,
} from '@product/domain/cqrs/command';
import { ProductNotFoundError } from '@product/domain/error';
import { ConflictError, NotFoundError } from '@common/domain/error/rest';
import { CountAllProductsQuery, GetAllProductsQuery, GetProductByIdQuery } from '@product/domain/cqrs/query';
import { v7 } from 'uuid';
import { Injectable } from '@common/application/decorator';
import mongoose from 'mongoose';

interface ICreateBody {
  name: string,
  description: string,
  price: string,
  stock: number,
}

interface IFindProductsQuery {
  page: number,
  itemsPerPage: number,
  sortBy: string,
  sortDir: string,
  name?: string,
}

@Injectable()
export class ProductService {
  public constructor (
    private readonly queryBus: QueryBusService,
    private readonly commandBus: CommandBusService,
  ) {
  }

  public getProduct (id: string, session: mongoose.ClientSession): Promise<IProductSchema> {
    return this.queryBus.execute<GetProductByIdQuery, IProductSchema>(new GetProductByIdQuery(id), session).catch((err) => {
      if (err instanceof ProductNotFoundError) {
        throw new NotFoundError(err.defaultMessage, err.name);
      }

      throw new ConflictError(err.message, 'Conflict');
    });
  }

  public async getProductsAndCount (dto: IFindProductsQuery, session: mongoose.ClientSession): Promise<[IProductSchema[], number]> {
    return await Promise.all([
      this.queryBus.execute<GetAllProductsQuery, IProductSchema[]>(new GetAllProductsQuery(
        { name: dto.name },
        dto.page,
        dto.itemsPerPage,
        dto.sortBy,
        dto.sortDir,
      ), session).catch((err) => {
        throw new ConflictError(err.message, 'Conflict');
      }),
      this.queryBus.execute<CountAllProductsQuery, number>(new CountAllProductsQuery({ name: dto.name }), session).catch((err) => {
        throw new ConflictError(err.message, 'Conflict');
      }),
    ]);
  }

  public async createProduct (body: ICreateBody, session: mongoose.ClientSession): Promise<string> {
    const id = v7();

    await this.commandBus.execute(new CreateProductCommand(id, body.name, body.description, body.price, body.stock), session).catch(err => {
      throw new ConflictError(err.message, 'Conflict');
    });

    await this.getProduct(id, session);

    return id;
  }

  public async incrementProductStock (id: string, count: number, session: mongoose.ClientSession): Promise<void> {
    await this.commandBus.execute(new IncrementProductStockCommand(id, count), session).catch((err) => {
      throw new ConflictError(err.message, 'Conflict');
    });
  }

  public async decrementProductStock (id: string, count: number, session: mongoose.ClientSession): Promise<void> {
    await this.commandBus.execute(new DecrementProductStockCommand(id, count), session).catch((err) => {
      throw new ConflictError(err.message, 'Conflict');
    });
  }
}
