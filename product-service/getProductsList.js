import { headers } from '../constants';
import { client } from './db';

export const get = async event => {
  console.log(event);

  try {
    const query = 'select id, title, description, price, count from products left join stocks on products.id = stocks.product_id';
    const { rows } = await client.query(query);

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch(error) {
    return {
      headers,
      statusCode: 500,
      body: error.toString(),
    };
  }
};
