const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const db = require('../db');

async function seedEmployees() {
    try {
        const employees = [
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@company.com',
                position: 'Software Engineer',
                department: 'Engineering',
                salary: 85000.00
            },
            {
                name: 'Bob Smith',
                email: 'bob.smith@company.com',
                position: 'Product Manager',
                department: 'Product',
                salary: 95000.00
            },
            {
                name: 'Carol Williams',
                email: 'carol.williams@company.com',
                position: 'UI/UX Designer',
                department: 'Design',
                salary: 75000.00
            },
            {
                name: 'David Brown',
                email: 'david.brown@company.com',
                position: 'HR Manager',
                department: 'Human Resources',
                salary: 70000.00
            },
            {
                name: 'Emma Davis',
                email: 'emma.davis@company.com',
                position: 'Senior Developer',
                department: 'Engineering',
                salary: 95000.00
            }
        ];

        for (const emp of employees) {
            await db.query(`
                INSERT INTO employees (name, email, position, department, salary)
                VALUES ($1, $2, $3, $4, $5)`,
                [emp.name, emp.email, emp.position, emp.department, emp.salary]
            );
            console.log('Inserted employee:', emp.email);
        }   
    } catch (err) {
        console.error('Error seeding employees:', err);
    }   
}

seedEmployees();