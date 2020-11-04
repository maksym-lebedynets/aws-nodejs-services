'use strict';

import products from './products.json';
import { headers } from './constants';

export const get = async event => {
  try {
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch(error) {
    return {
      headers,
      statusCode: 500,
      body: error.toString(),
    };
  }
};
