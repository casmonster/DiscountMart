
import * as dotenv from 'dotenv';
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "../.env") });

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema.js';



const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

// Explicitly validate and cast env variables
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Missing required environment variables for database connection.');
}

const poolConfig: PoolConfig = {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
};

if (DB_HOST.startsWith('/cloudsql')) {
    poolConfig.host = DB_HOST;
} else {
    if (!DB_PORT) {
        throw new Error('DB_PORT is required for non-Cloud SQL connections');
    }
    poolConfig.host = DB_HOST;
    poolConfig.port = parseInt(DB_PORT);
    poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

export const db = drizzle(pool, { schema });
