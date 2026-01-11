const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

/* LOGIN */
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with:', req.body);  // ✅ Log request

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('User found:', user);  // ✅ Log user

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);  // ✅ Log password check

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);  // ✅ Log JWT_SECRET

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token created:', token);  // ✅ Log token

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log('Login Error:', error.message);  // ✅ Log error
    res.status(500).json({ message: 'Server probleme', error: error.message });
  }
});

/* LOGOUT */
router.post('/logout', (req, res) => {
  try {
    // JWT logout:  token is deleted on frontend
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
        id: user._id,
        name: user.name,
        email: user.email,
	password: user.password
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
