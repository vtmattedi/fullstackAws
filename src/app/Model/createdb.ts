import * as fs from 'fs';
import { assertDotEnv } from '../Asserter';
import  { db_pool } from './db';

/**
 * Runs a sql file.
 * 
 * @param {string} filePath - The path to the sql file.
 * @returns { Promise<boolean>} - The result of the operation.
 */
const runSqlFile = async (filePath: string) => {
    if (!assertDotEnv()) {
        console.log('Error creating database: .env file not found');
        return false;
    }

    
    const file = fs.readFileSync(filePath);
    const queries =  file.toString().split(';');
    
    for (const query of queries) {
        if (query.trim() === '') continue;
        await db_pool.query(query).then(
            (result) => {
                console.log('query success:');
            }
        ).catch(
            (err) => {
                console.log('query failed:', err.code);
            }
        );
    }
    return true;

};


export { runSqlFile };

