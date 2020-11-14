import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DB_NAME, PG_DB_USERNAME, PG_SB_PASSWORD } = process.env;

export const client = new Client({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DB_NAME,
  user: PG_DB_USERNAME,
  password: PG_SB_PASSWORD,
});

client.connect();
