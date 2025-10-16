const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../db');

// Sign in
router.post('/signin', async(req, res) => {

    const { email, password } = req.body;
    try{
        const userRes = await db.query('SELECT * FROM users WHERE email=$1', [email])
        if (userRes.rows.length === 0){
            return res.status(404).json({ error: 'User not found' }) }

        const user = userRes.rows[0];
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(401).json({ error: 'Invalid password' }) }       

        const token = jwt.sign({id :user.id, role : user.role}, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.json({message: 'Sign in successful', token, user: {id: user.id, name: user.name, email: user.email, role: user.role}})
}
catch(err){
    console.error('Error during sign in:', err);
    res.status(500).json({ error: 'Internal server error' });
}
})

module.exports = router;

