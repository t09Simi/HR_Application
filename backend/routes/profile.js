const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET - Employee fetches their own profile
router.get('/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    try {
        // Verify user can only access their own profile
        if (userId !== requestingUserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to access this profile' });
        }

        const query = 'SELECT id, name, email, address, phone_number, role FROM users WHERE id=$1';
        const result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT - Employee updates their own profile
router.put('/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const requestingUserId = req.user.id;
    const { name, email, address, phone_number, password } = req.body;

    try {
        // Verify user can only update their own profile
        if (userId !== requestingUserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }

        let hashedPassword = null;
        if (password) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updateFields = [];
        const updateValues = [];
        let index = 1;

        if (name) {
            updateFields.push(`name=$${index++}`);
            updateValues.push(name);
        }

        if (email) {
            updateFields.push(`email=$${index++}`);
            updateValues.push(email);
        }

        if (address) {
            updateFields.push(`address=$${index++}`);
            updateValues.push(address);
        }

        if (phone_number) {
            updateFields.push(`phone_number=$${index++}`);
            updateValues.push(phone_number);
        }

        if (hashedPassword) {
            updateFields.push(`password=$${index++}`);
            updateValues.push(hashedPassword);
        }

        // Check if there are fields to update
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updateValues.push(userId);

        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${index} RETURNING id, name, email, address, phone_number, role`;
        const result = await db.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;