import { client } from './db';

export const createProducts = async (values) => {
  try {
    await client.query('BEGIN');

    for (const value of values) {
      const { title, description, price } = value;
      const addProductQuery = 'insert into products (title, description, price) values ($1, $2, $3) returning *';
      const { rows } = await client.query(addProductQuery, [title, description, +price]);
      const addToStockQuery = 'insert into stocks(product_id, count) values ($1, $2)';
      const productId = rows[0].id;

      await client.query(addToStockQuery, [productId, 1]);
    }

    await client.query('COMMIT');
  } catch(error) {
    await client.query('ROLLBACK');
    console.log('Product creation failed');
  }
}