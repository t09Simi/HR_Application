const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const db = require('../db');

async function adduserdetails() {
    try {
        console.log('Starting migration: Adding address and phone_number to users table...\n');

        // Check if columns already exist
        const checkColumns = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('address', 'phone_number')
        `);

        const existingColumns = checkColumns.rows.map(row => row.column_name);

        // Add address column if it doesn't exist
        if (!existingColumns.includes('address')) {
            await db.query(`
                ALTER TABLE users 
                ADD COLUMN address VARCHAR(255)
            `);
            console.log(' Added address column to users table');
        } else {
            console.log('address column already exists');
        }

        // Add phone_number column if it doesn't exist
        if (!existingColumns.includes('phone_number')) {
            await db.query(`
                ALTER TABLE users 
                ADD COLUMN phone_number VARCHAR(50)
            `);
            console.log(' Added phone_number column to users table');
        } else {
            console.log(' phone_number column already exists');
        }

        // Get all users without address or phone_number
        const usersToUpdate = await db.query(`
            SELECT id, name, email 
            FROM users 
            WHERE address IS NULL OR phone_number IS NULL
        `);

        if (usersToUpdate.rows.length === 0) {
            console.log('○ All users already have address and phone_number');
        } else {
            console.log(`Found ${usersToUpdate.rows.length} user(s) to update:\n`);

            
            await db.query(`
                UPDATE users 
                SET address = $1, phone_number = $2
                WHERE email = $3
            `, ['123 Main St, London', '07700900000', 'employee@company.com']);
            console.log(' Updated admin user with specific address and phone');

        // Verify the changes
        const result = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);

        console.log('\n Current users table structure:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type}`);
        });

        console.log('\n Migration completed successfully!');
        process.exit(0);
    } 
    }catch (err) {
        console.error(' Migration failed:', err);
        process.exit(1);
    }
}


adduserdetails();