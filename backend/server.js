// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');



const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const profileRoutes = require('./routes/profile');

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
                                 // For local :app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'HR Portal API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  {console.log(`Server running on port ${PORT}`)
});
