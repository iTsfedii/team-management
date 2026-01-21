const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const InternApplication = require('../models/InternApplication');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// ⭐ GET ADMIN DASHBOARD STATISTICS - Admin only
router.get('/statistics', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    // Count all users by role
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const employees = await User. countDocuments({ role: 'employee' });
    const interns = await User.countDocuments({ role: 'intern' });

    // Count tasks
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });

    // Count applications
    const totalApplications = await InternApplication.countDocuments();
    const approvedApplications = await InternApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await InternApplication.countDocuments({ status: 'rejected' });
    const pendingApplications = await InternApplication.countDocuments({ status: 'pending' });

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      statistics: {
        users: {
          total: totalUsers,
          admins,
          employees,
          interns
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks
        },
        applications:  {
          total: totalApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
          pending: pendingApplications
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ GET ALL USERS WITH DETAILS - Admin only
router.get('/users', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    res.json({
      message: 'All users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error. message });
  }
});

// ⭐ GET ALL TASKS WITH DETAILS - Admin only
router.get('/tasks', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .lean();

    res.json({
      message: 'All tasks retrieved successfully',
      count: tasks. length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ GET ALL APPLICATIONS WITH DETAILS - Admin only
router. get('/applications', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const applications = await InternApplication.find()
      .populate('decidedBy', 'name email')
      .lean();

    res.json({
      message: 'All applications retrieved successfully',
      count: applications. length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ GET PENDING APPLICATIONS ONLY - Admin only
router.get('/applications/pending', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const pendingApps = await InternApplication.find({ status: 'pending' })
      .lean();

    res.json({
      message: 'Pending applications retrieved successfully',
      count: pendingApps.length,
      applications: pendingApps
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ DELETE TASK - Admin only
router.delete('/tasks/:taskId', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ DELETE APPLICATION - Admin only
router.delete('/applications/:appId', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    await InternApplication.findByIdAndDelete(req.params. appId);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
