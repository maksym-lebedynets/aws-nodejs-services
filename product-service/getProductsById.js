import { headers } from './constants';
import { client } from './db';

export const getById = async event => {
  console.log(event);

  try {
    const { pathParameters } = event;
    const { id } = pathParameters;
    const query = `select id, title, description, price, count from products left join stocks on products.id = stocks.product_id where products.id = $1`;
    const { rows } = await client.query(query, [id]);

    if (rows.length) {
      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(rows[0]),
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
