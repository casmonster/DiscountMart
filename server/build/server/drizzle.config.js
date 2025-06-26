import * as dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
const config = {
    schema: ['./server/schema.ts'],
    out: './server/drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: 'require', // or `true`
    },
    verbose: true,
    strict: true,
};
export default config;
