import { Injectable } from '@common/application/decorator';

@Injectable()
export class ProductIdFormat {
  public format (productId: string) {
    return {
      id: productId,
    };
  }
}
