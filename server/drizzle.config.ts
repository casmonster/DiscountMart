// drizzle.config.ts
import { type Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({path: './server/.env'});

const config: Config = {
  schema: './server/schema.ts',
  out: './server/drizzle',
  dialect: 'postgresql',
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



export default config;
