
import mysql from 'mysql2';
import { assertDotEnv } from '../Asserter';

if (!assertDotEnv()) {
    console.log('failed to load .env.')
    throw new Error('Failed to load .env')
}
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:',parseInt(process.env.DB_PORT as string));
console.log('DB_PWD:', process.env.DB_PWD);
console.log('DB_NAME:', process.env.DB_NAME);
const db_pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'magicaldb',
}).promise();



export { db_pool };