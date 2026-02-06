const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// ✅ This import is correct!
const { sendLoginEmail } = require('../config/emailService');

/* LOGIN */
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with:', req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token created:', token);

    // ✅ FIXED: Use the sendLoginEmail function (fire-and-forget)
    sendLoginEmail(user.email, user.name).catch(err => {
      console.error('Email notification failed (but login succeeded):', err);
    });

    // ✅ Respond to client immediately (don't wait for email)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.log('Login Error:', error.message);
    res.status(500).json({ message: 'Server problem', error: error.message });
  }
});

/* LOGOUT */
router.post('/logout', (req, res) => {
  try {
    // JWT logout: token is deleted on frontend
    // Backend just confirms logout was successful
    res.status(200).json({
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Logout error', 
      error: error.message 
    });
  }
});

/* REGISTER */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
