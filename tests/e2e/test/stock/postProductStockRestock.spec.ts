import { getApi } from '../../config';
import TestAgent from 'supertest/lib/agent';
import * as faker from 'faker';
import { ProductRepository } from '@product/infrastructure/repository';
import { DependencyService } from '@common/application/service';
import { v7 } from 'uuid';

describe('POST /products/:id/restock', () => {
  let app: TestAgent;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    app = await getApi();
    productRepository = DependencyService.instance().resolve(ProductRepository);
  });

  it('should restock a product stock', async () => {
    const productId = v7();

    await productRepository.create(new productRepository.model({
      id: productId,
      name: faker.datatype.string(50),
      description: faker.datatype.string(50),
      price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }).toFixed(2),
      stock: faker.datatype.number({ min: 10000, max: 10000 }),
      createdAt: faker.date.future(),
    }));

    const change = {
      count: faker.datatype.number({ min: 0, max: 10 }),
    };

    const response = await app.post('/products/' + productId + '/restock').send(change);

    expect(response.status).toBe(204);
  });
});
