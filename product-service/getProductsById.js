'use strict';

import products from './products.json';
import { headers } from './constants';

export const getById = async event => {
  try {
    const { pathParameters } = event;
    const { id: requiredProductId } = pathParameters;
    const product = products.find(({ id }) => id === (+requiredProductId));

    if (product) {
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        headers,
        statusCode: 404,
        body: 'Product not found'
      };
    }
  } catch(error) {
    return {
      headers,
      statusCode: 500,
      body: error.toString(),
    };
  }
};
