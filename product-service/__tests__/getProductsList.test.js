import { get } from '../getProductsList';
import { headers } from '../../constants';
import products from '../products.json';

describe('getProductsList', () => {
  describe('get', () => {
    it('should return all products', async () => {
      expect(await get()).toEqual({
        headers,
        statusCode: 200,
        body: JSON.stringify(products),
      });
    });
  });
});