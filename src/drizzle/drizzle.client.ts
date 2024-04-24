import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const dbConnPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const drizzleClient = drizzle(dbConnPool);
export type DrizzleClient = typeof drizzleClient;