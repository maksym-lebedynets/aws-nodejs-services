'use strict';

import products from './products.json';
import { headers } from './constants';

export const get = async event => {
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
