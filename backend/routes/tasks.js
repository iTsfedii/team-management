const express = require('express');
const Task = require('../models/Task');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// ⭐ CREATE TASK - Only admins can create
router.post('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,  // ← Admin who created it
      priority,
      dueDate
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ GET ALL TASKS - Only admins
router.get('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error. message });
  }
});

// ⭐ GET MY TASKS - Employees see their assigned tasks
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const myTasks = await Task.find({ assignedTo: req.user._id })
      .populate('createdBy', 'name email');

    res.json(myTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ UPDATE TASK - Only admins
router.put('/:id', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params. id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ⭐ DELETE TASK - Only admins
router.delete('/:id', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
