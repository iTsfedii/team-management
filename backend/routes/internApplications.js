const express = require('express');
const InternApplication = require('../models/InternApplication');
const { verifyToken, authorize, validateInput } = require('../middleware/auth');

const router = express. Router();

// ⭐ SUBMIT APPLICATION - Any logged-in user
router.post('/',
  validateInput(['name', 'email', 'motivation']),
  async (req, res) => {
    try {
      const { name, email, motivation } = req.body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate motivation length
      if (motivation.length < 10) {
        return res.status(400).json({ message: 'Motivation must be at least 10 characters' });
      }

      const application = await InternApplication.create({
        name,
        email,
        motivation,
        status: 'pending'
      });

      res.status(201).json({
        message: 'Application submitted successfully',
        application
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error:  error.message });
    }
  }
);

// ⭐ GET ALL APPLICATIONS - Admin only
router.get('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const applications = await InternApplication.find()
      .populate('decidedBy', 'name email');

    res.json({
      message: 'All applications retrieved successfully',
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ UPDATE APPLICATION STATUS - Admin only
router.put('/:id/status',
  verifyToken,
  authorize(['admin']),
  validateInput(['status']),
  async (req, res) => {
    try {
      const { status } = req.body;

      // Validate status
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be: pending, approved, or rejected' });
      }

      const application = await InternApplication. findByIdAndUpdate(
        req.params.id,
        { status, decidedBy: req.user._id },
        { new: true }
      ).populate('decidedBy', 'name email');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      res.json({
        message: `Application ${status} successfully`,
        application
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
