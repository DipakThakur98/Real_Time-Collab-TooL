const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'collab_db',
            multipleStatements: true
        });

        console.log('Connected to MySQL.');

        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await connection.query(schema);

        console.log('Schema initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error initializing schema:', error);
        process.exit(1);
    }
}

runSchema();
