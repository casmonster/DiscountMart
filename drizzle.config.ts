// drizzle.config.ts
import type{ Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({path: './server/.env'});

export default {
  schema: ['./server/schema.ts'],
  out: './server/drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: false, 
  },
  verbose: true,
  strict: true,
};




