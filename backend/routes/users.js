const express = require('express');
const User = require('../models/User');
const { verifyToken, authorize, validateInput } = require('../middleware/auth');

const router = express. Router();

// ⭐ GET MY PROFILE - Any logged-in user
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ UPDATE MY PROFILE - Any logged-in user
router.put('/profile', 
  verifyToken,
  validateInput(['name', 'email']),
  async (req, res) => {
    try {
      const { name, email } = req.body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true }
      ).select('-password');

      res.json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error. message });
    }
  }
);

// ⭐ LIST ALL USERS - Admin only
router. get('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const users = await User. find().select('-password');

    res.json({
      message: 'Users retrieved successfully',
      count: users. length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ CHANGE USER ROLE - Admin only
router. put('/:userId/role', 
  verifyToken, 
  authorize(['admin']),
  validateInput(['role']),
  async (req, res) => {
    try {
      const { role } = req.body;

      // Validate role
      if (!['admin', 'employee', 'intern'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be: admin, employee, or intern' });
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: `User role changed to ${role}`,
        user
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ⭐ DELETE USER - Admin only
router.delete('/:userId', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/*
CHANGE PASSWORD
Any logged user
*/
router.put(
  '/change-password',
  verifyToken,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }

      // Get user
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);





module.exports = router;
