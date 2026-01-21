const express = require('express')
const mongoose = require('mongoose')
const Task = require('../models/Task')
const { verifyToken, authorize, validateInput } = require('../middleware/auth')

const router = express.Router()

const PRIORITIES = ['low', 'medium', 'high']

function isValidFutureDate(date) {
  if (!Date.parse(date)) return false
  return new Date(date) > new Date()
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

/*
CREATE TASK
Admin only
*/
router.post(
  '/',
  verifyToken,
  authorize(['admin']),
  validateInput(['title', 'assignedTo', 'priority', 'dueDate']),
  async (req, res) => {
    try {
      const { title, description, assignedTo, priority, dueDate } = req.body

      if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' })
      }

      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assigned user' })
      }

      if (!isValidFutureDate(dueDate)) {
        return res.status(400).json({ message: 'Invalid due date' })
      }

      const task = await Task.create({
        title,
        description,
        assignedTo,
        priority,
        dueDate,
        createdBy: req.user._id
      })

      res.status(201).json({ message: 'Task created', task })
    } catch {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

/*
GET ALL TASKS
Admin only
*/
router.get(
  '/',
  verifyToken,
  authorize(['admin']),
  async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate('assignedTo', 'name email role')
        .populate('createdBy', 'name email')

      res.json({ count: tasks.length, tasks })
    } catch {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

/*
GET MY TASKS
Any logged user
*/
router.get(
  '/my-tasks',
  verifyToken,
  async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.user._id })
        .populate('createdBy', 'name email')

      res.json({ count: tasks.length, tasks })
    } catch {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

/*
UPDATE TASK
Admin only
*/
router.put(
  '/:id',
  verifyToken,
  async (req, res) => {
    try {
      if (!isValidObjectId(req.params. id)) {
        return res. status(400).json({ message: 'Invalid task id' })
      }

      // Get the task first
      const task = await Task. findById(req.params.id)
      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Only admin or the assigned employee can update
      const isAdmin = req.user. role === 'admin'
      const isAssigned = task.assignedTo.toString() === req.user._id.toString()

      if (!isAdmin && !isAssigned) {
        return res.status(403).json({ message: 'Not authorized to update this task' })
      }

      const update = {}
      const { title, description, priority, dueDate, completed } = req.body

      if (title) update.title = title
      if (description) update.description = description
      if (typeof completed === 'boolean') update.completed = completed

      if (priority) {
        if (!PRIORITIES.includes(priority)) {
          return res. status(400).json({ message: 'Invalid priority' })
        }
        update.priority = priority
      }

      if (dueDate) {
        if (!isValidFutureDate(dueDate)) {
          return res.status(400).json({ message: 'Invalid due date' })
        }
        update.dueDate = dueDate
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
      )

      res.json({ message: 'Task updated', task: updatedTask })
    } catch {
      res.status(500).json({ message: 'Server error' })
    }
  }
)
/*
DELETE TASK
Admin only
*/
router.delete(
  '/:id',
  verifyToken,
  authorize(['admin']),
  async (req, res) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid task id' })
      }

      const task = await Task.findByIdAndDelete(req.params.id)

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      res.json({ message: 'Task deleted' })
    } catch {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

module.exports = router

