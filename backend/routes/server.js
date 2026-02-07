require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const internApplicationRoutes = require('./routes/internApplications');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

connectDB();

// ⭐ SECURITY: Rate Limiting Configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
      error: 'Rate limit exceeded'
    });
  }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests from this IP. Please try again later.',
      error: 'Rate limit exceeded'
    });
  }
});

app.use(cors());
app.use(express.json());

// ⭐ Apply Rate Limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/intern-applications', internApplicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!  Server is running!');
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

module.exports = app;
