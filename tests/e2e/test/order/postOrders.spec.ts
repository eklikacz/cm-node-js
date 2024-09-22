import { getApi } from '../../config';
import TestAgent from 'supertest/lib/agent';
import * as faker from 'faker';
import { ProductRepository } from '@product/infrastructure/repository';
import { DependencyService } from '@common/application/service';

describe('POST /products', () => {
  let app: TestAgent;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    app = getApi();
    productRepository = DependencyService.instance().resolve(ProductRepository);
  });

  it('should create a new order', async () => {
    const productId = faker.datatype.uuid();

    productRepository.create(new productRepository.model({
      id: productId,
      name: faker.datatype.string(50),
      description: faker.datatype.string(50),
      price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }).toFixed(2),
      stock: faker.datatype.number({ min: 10000, max: 10000 }),
      createdAt: faker.date.future(),
    }));

    const newOrder = {
      customerId: faker.datatype.uuid(),
      products: faker.random.objectElement({
        id: productId,
        count: faker.datatype.number({ min: 1, max: 10000 }),
        price: faker.datatype.number({ min: 1, max: 10000, precision: 2 }).toFixed(2),
      }),
    };

    const response = await app.post('/orders').send(newOrder);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
