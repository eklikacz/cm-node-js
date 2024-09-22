import { getApi } from '../../config';
import * as faker from 'faker';

describe('POST /products/:id/restock', () => {
  it('should restock a product stock', async () => {
    const newProduct = {
      name: faker.datatype.string(50),
      description: faker.datatype.string(50),
      price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }).toFixed(2),
      stock: faker.datatype.number({ min: 0, max: 10000 }),
    };

    const response = await getApi().post('/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
