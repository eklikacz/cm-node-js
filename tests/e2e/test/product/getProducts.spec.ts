import { getApi } from '../../config';
import TestAgent from 'supertest/lib/agent';
import * as faker from 'faker';
import { ProductRepository } from '@product/infrastructure/repository';
import { DependencyService } from '@common/application/service';
import { v7 } from 'uuid';

describe('GET /products', () => {
  let app: TestAgent;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    app = await getApi();
    productRepository = DependencyService.instance().resolve(ProductRepository);
  });

  it('should return a list of products', async () => {
    await productRepository.create(new productRepository.model({
      id: v7(),
      name: faker.datatype.string(50),
      description: faker.datatype.string(50),
      price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }).toFixed(2),
      stock: faker.datatype.number({ min: 10000, max: 10000 }),
      createdAt: faker.date.future(),
    }));

    const response = await app.get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.totalCount).toBe(1);
  });
});
