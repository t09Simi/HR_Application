const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all employees
router.get('/', verifyToken, async(req, res) => {
    try{
        const results = await db.query('SELECT * FROM employees ORDER BY id ')
        res.json(results.rows)
    } catch(err){
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Add employee (ADMIN only)
router.post('/', verifyToken, async(req, res) => {

    const {name, email, position, department, salary} = req.body
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({ error: 'Access denied, admin only'})
        }
        await db.query( `INSERT INTO employees(name, email, position, department, salary) VALUES ($1, $2, $3, $4, $5)`,
        [name, email, position, department, salary])
        res.json({message: 'Employee added successfully'})
    }
    catch(err){
        console.error('Error adding employee:', err)
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single employee by ID 
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update employee (ADMIN only)
router.put('/:id', verifyToken, async(req, res) =>{
    const {id} = req.params
    const {name, email, position, department, salary} = req.body
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({ error: 'Access denied, admin only'})
        }
        await db.query(` UPDATE employees SET name=$1, email=$2, position=$3, department=$4, salary=$5 WHERE id=$6`,
            [name, email, position, department, salary, id])
        res.json({message: 'Employee updated successfully'})
    } catch(err){
        console.error('Error updating employee:', err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Delete employee (ADMIN only)
router.delete('/:id', verifyToken, async(req, res) =>{
    const {id} = req.params     
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({ error: 'Access denied, admin only'})
        }
        await db.query('DELETE FROM employees WHERE id=$1', [id])
        res.json({message: 'Employee deleted successfully'})
    }catch(err){
        console.error('Error deleting employee:', err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;