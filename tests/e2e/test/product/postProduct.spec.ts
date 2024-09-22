import { getApi } from '../../config';
import TestAgent from 'supertest/lib/agent';
import * as faker from 'faker';
import { ProductRepository } from '@product/infrastructure/repository';
import { DependencyService } from '@common/application/service';

describe('POST /products', () => {
  let app: TestAgent;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    app = await getApi();
    productRepository = DependencyService.instance().resolve(ProductRepository);
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: faker.datatype.string(50),
      description: faker.datatype.string(50),
      price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }).toFixed(2),
      stock: faker.datatype.number({ min: 0, max: 10000 }),
    };

    const response = await app.post('/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
