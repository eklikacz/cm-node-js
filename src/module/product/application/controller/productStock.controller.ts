import { Request, Response } from 'express';
import { ProductService } from '@product/application/service/product.service';
import { Injectable } from '@common/application/decorator';
import { RoutingValidatorService } from '@common/application/service';
import { HttpMethod } from '@common/domain/enum';
import { changeStockInput } from '@product/application/controller/input';

@Injectable()
export class ProductStockController {
  public constructor (
    private readonly productService: ProductService,
    private readonly routingValidator: RoutingValidatorService,
  ) {
    this.routingValidator
      .register(HttpMethod.POST, '/products/:id/restock', changeStockInput())
      .register(HttpMethod.POST, '/products/:id/sell', changeStockInput());
  }

  public async postProductRestock (req: Request, response: Response): Promise<void> {
    await this.productService.getProduct(req.params.id);
    await this.productService.incrementProductStock(req.params.id, req.body.count);
  }

  public async postProductSell (req: Request): Promise<void> {
    await this.productService.getProduct(req.params.id);
    await this.productService.decrementProductStock(req.params.id, req.body.count);
  }
}
