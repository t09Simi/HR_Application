const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const db = require('../db');

async function seedEmployee() {
    try {
        const email = 'employee@company.com';
        const name = 'John Employee';
        const password = 'employee123';
        const role = 'employee';
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, role]
        );  
        console.log('Employee created:', email, 'password:', password);
    } catch (err) {
        console.error('Error seeding employee:', err);
    }   
}

seedEmployee();