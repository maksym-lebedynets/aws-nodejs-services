import { headers } from '../constants';
import { client } from './db';

export const create = async (event) => {
  console.log(event);

  try {
    await client.query('BEGIN');

    const { title, description, price } = JSON.parse(event.body);
    const addProductQuery = 'insert into products (title, description, price) values ($1, $2, $3) returning *';
    const { rows } = await client.query(addProductQuery, [title, description, price]);
    const addToStockQuery = 'insert into stocks(product_id, count) values ($1, $2)';
    const productId = rows[0].id;

    await client.query(addToStockQuery, [productId, 1]);
    await client.query('COMMIT');

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        ...rows[0],
        count: 1,
      }),
    };
  } catch(error) {
    await client.query('ROLLBACK');
    return {
      headers,
      statusCode: 500,
      body: error.toString(),
    };
  }
}