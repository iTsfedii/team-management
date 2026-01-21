const express = require('express');
const InternApplication = require('../models/InternApplication');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// ⭐ APPLY FOR INTERNSHIP - Any logged-in user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, email, motivation } = req.body;

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ GET ALL APPLICATIONS - Only admins
router.get('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const applications = await InternApplication.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ APPROVE/REJECT APPLICATION - Only admins
router.put('/:id/status', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await InternApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        decidedBy: req.user._id  // ← Admin who made the decision
      },
      { new: true }
    );

    res.json({
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
