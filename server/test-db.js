const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3307
        });

        console.log('Successfully connected to MySQL!');
        
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + (process.env.DB_NAME || 'collab_db'));
        console.log('Database checked/created.');
        
        await connection.end();
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        process.exit(1);
    }
}

testConnection();
