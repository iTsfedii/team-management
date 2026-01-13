const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth')
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());  // ← ADD THIS (MUST BE BEFORE ROUTES)
app.use(express.json());

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!  Server is running!');
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

module.exports = app;
