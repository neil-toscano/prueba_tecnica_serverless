import * as mysql from 'mysql2/promise';
import { Connection } from 'mysql2/promise';

export async function createMySQLConnection(database: string): Promise<Connection> {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '',
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: database,
            port: parseInt(process.env.DB_PORT || '3306'),
        });

        console.log(`Connected to MySQL database: ${database}`);
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
}