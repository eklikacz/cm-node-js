import { getApi } from '../../config';

describe('GET /products', () => {
  it('should return a list of products', async () => {
    const response = await getApi().get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
