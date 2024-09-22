import { Request } from 'express';
import { ProductService } from '@product/application/service';
import { Injectable } from '@common/application/decorator';
import { IProduct, ProductIdFormat, ProductsFormat } from '@product/application/controller/format';
import { ICollection, ICreateEntity } from '@common/application/interface';
import { RoutingValidatorService } from '@common/application/service';
import { HttpMethod } from '@common/domain/enum';
import { createProductInput, getProductsInput } from '@product/application/controller/input';

@Injectable()
export class ProductsController {
  public constructor (
    private readonly productService: ProductService,
    private readonly productsFormat: ProductsFormat,
    private readonly productIdFormat: ProductIdFormat,
    private readonly routingValidator: RoutingValidatorService,
  ) {
    this.routingValidator
      .register(HttpMethod.GET, '/products', getProductsInput())
      .register(HttpMethod.POST, '/products', createProductInput());
  }

  public async getProducts (req: Request): Promise<ICollection<IProduct>> {
    const page = Number(req.query.page ?? 1);
    const itemsPerPage = Number(req.query.itemsPerPage ?? 10);
    const sortBy = String(req.query.sortBy ?? 'createdAt');
    const sortDir = String(req.query.sortDir ?? 'asc');
    const [products, count] = await this.productService.getProductsAndCount({
      name: req.query.name ? String(req.query.name) : undefined,
      page,
      itemsPerPage,
      sortBy,
      sortDir,
    });

    return {
      data: this.productsFormat.formatProducts(products),
      page,
      itemsPerPage,
      totalCount: count,
      hasNextPage: page * itemsPerPage < count,
      hasPreviousPage: page > 1,
    };
  }

  public async postProduct (req: Request): Promise<ICreateEntity> {
    const productId = await this.productService.createProduct(req.body);

    return {
      data: this.productIdFormat.format(productId),
    };
  }
}
