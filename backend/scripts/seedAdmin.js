const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const db = require('../db');
async function seedAdmin() {
    try{
        const email = 'johnswan@gmail.com';
        const name = 'John Swan';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)`
            , [name, email, hashedPassword, 'admin'])
            console.log('Admin created:', email, 'password:', password);
    }
    catch(err){
        console.error('Error seeding admin:', err);
    }
}

seedAdmin();