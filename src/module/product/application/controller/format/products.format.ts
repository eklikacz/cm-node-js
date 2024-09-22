import { Injectable } from '@common/application/decorator';
import { IProduct, ProductFormat } from '@product/application/controller/format/product.format';
import { IProductSchema } from '@product/domain/schema';

@Injectable()
export class ProductsFormat {
  public constructor (private readonly productsFormat: ProductFormat) {}

  public formatProducts (entities: IProductSchema[]): IProduct[] {
    return entities.map(entity => this.productsFormat.formatProduct(entity));
  }
}
