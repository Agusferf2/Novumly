import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './env.js';
import * as schema from '../db/schema.js';

export const client = postgres(env.databaseUrl, {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, { schema });

export async function connectDB() {
  try {
    await client`select 1`;
    console.log('[db] Neon Postgres connected');
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
    process.exit(1);
  }
}
