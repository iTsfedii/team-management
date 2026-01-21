const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const internApplicationRoutes = require('./routes/internApplications');
const User = require('./models/User');
const Task = require('./models/Task');
const InternApplication = require('./models/InternApplication');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

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
