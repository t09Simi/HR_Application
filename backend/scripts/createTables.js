const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const db = require('../db');

async function createTables() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Users table created\n');

        await db.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                position VARCHAR(255) NOT NULL,
                department VARCHAR(255) NOT NULL,
                salary DECIMAL(10, 2) NOT NULL CHECK (salary > 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log(' Employees table created\n');

        await db.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                position VARCHAR(255) NOT NULL,
                department VARCHAR(255) NOT NULL,
                salary DECIMAL(10, 2) NOT NULL CHECK (salary > 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log(' Employees table created\n');
        // Verify tables were created
        const result = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        console.log(' Tables in database:');
        result.rows.forEach(row => {
            console.log('  - ' + row.table_name);
        });

        console.log('\n Database setup complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createTables();

