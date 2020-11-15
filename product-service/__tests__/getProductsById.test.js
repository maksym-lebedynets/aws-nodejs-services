import { getById } from '../getProductsById';
import { headers } from '../constants';
import products from '../products.json';

describe('getProductsById', () => {
  describe('getById', () => {
    it('should return the product by ID', async () => {
      const productId = 1;
      const gatewayEvent = {
        pathParameters: {
          id: '1',
        },
      };
      const product = products.find(({ id }) => id === productId);
      const response = {
        headers,
        statusCode: 200,
        body: JSON.stringify(product),
      };
      
      expect(await getById(gatewayEvent)).toEqual(response);
    });

    it('should return Not Found if product with specific ID is not found', async () => {
      const gatewayEvent = {
        pathParameters: {
          id: '1000',
        },
      };
      const response = {
        headers,
        statusCode: 404,
        body: 'Product not found',
      };

      expect(await getById(gatewayEvent)).toEqual(response);
    });

    it('should return error if something went wrong', async () => {
      const gatewayEvent = {
        wrongParameter: {},
      };
      const errorResponse = {
        headers,
        statusCode: 500,
        body: expect.any(String),
      }

      expect(await getById(gatewayEvent)).toEqual(errorResponse);
    });
  });
});