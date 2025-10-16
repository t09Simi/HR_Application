// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// quick DB test route
app.get('/db-test', async (req, res) => {
  try {
    const r = await db.query('SELECT now()');
    return res.json({ now: r.rows[0].now });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'db error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
