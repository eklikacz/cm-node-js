import { Injectable } from '@common/application/decorator';

@Injectable()
export class OrderIdFormat {
  public format (orderId: string) {
    return {
      id: orderId,
    };
  }
}
