import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: './server/.env' });

const config: Config = {
  schema: ['./server/schema.ts'],
  out: './server/drizzle',
  dialect: 'postgresql',
  
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: 'require', // or `true`
  },
  verbose: true,
  strict: true,
};

export default config;
