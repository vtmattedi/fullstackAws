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
    const querries =  file.toString().split(';');
    
    for (const querry of querries) {
        if (querry.trim() === '') continue;
        await db_pool.query(querry).then(
            (result) => {
                console.log('querry success:');
            }
        ).catch(
            (err) => {
                console.log('querry failed:', err.code);
            }
        );
    }
    return true;

};


export { runSqlFile };

