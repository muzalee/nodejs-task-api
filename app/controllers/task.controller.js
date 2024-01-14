const Task = require('../models').tasks
const { check, validationResult } = require('express-validator')
const mongoose = require('mongoose')

exports.create = [
  check('title').notEmpty().withMessage('Title is required'),
  check('priority').isInt({ gt: 0, lt: 4 }).withMessage('Priority must be between 1 and 3'),
  check('due_date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be in the format YYYY-MM-DD'),
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: new Date(req.body.due_date),
      priority: req.body.priority,
      isCompleted: false,
      isArchived: false
    })

    newTask.save()
      .then(result => {
        res.status(200).send({ status: true, data: result })
      })
      .catch(err => {
        res.status(500).send({ status: false, msg: err })
      })
  }
]

exports.findAll = (req, res) => {
  const query = {}

  if (req.query.priority) {
    query.priority = parseInt(req.query.priority)
  }

  const sort = {}
  if (req.query.sort) {
    const sortKeys = req.query.sort.split(',')
    sortKeys.forEach((key) => {
      const direction = key[0] === '-' ? -1 : 1
      sort[key.slice(1)] = direction
    })
  }

  Task.find(query).sort(sort)
    .then(tasks => {
      if (tasks) {
        res.status(200).send({ status: true, data: tasks })
      } else {
        res.status(404).send({ status: false, msg: 'No tasks found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.findOne = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ status: false, msg: 'Task not found.' })
  }

  Task.findById(req.params.id)
    .then(task => {
      if (task) {
        res.status(200).send({ status: true, data: task })
      } else {
        res.status(404).send({ status: false, msg: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send({ status: false, msg: err })
    })
}

exports.update = [
  check('title').notEmpty().withMessage('Title is required'),
  check('priority').isInt({ gt: 0, lt: 4 }).withMessage('Priority must be between 1 and 3'),
  check('due_date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be in the format YYYY-MM-DD'),
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ status: false, msg: 'Task not found.' })
    }

    Task.findById(req.params.id)
      .then(task => {
        if (!task) {
          return res.status(404).json({ status: false, msg: 'Task not found.' })
        }

        if (req.body.due_date) {
          req.body.dueDate = new Date(req.body.due_date)
        }

        task.set(req.body)

        return task.save()
      })
      .then(updatedTask => {
        res.status(200).send(updatedTask)
      })
      .catch(err => {
        res.status(500).send({ status: false, msg: err })
      })
  }
]

exports.delete = (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then(deletedTask => {
      if (deletedTask) {
        res.status(200).send(deletedTask)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.findArchived = (req, res) => {
  Task.find({ isArchived: true })
    .then(archivedTasks => {
      if (archivedTasks) {
        res.status(200).send(archivedTasks)
      } else {
        res.status(404).send({ message: 'No archived tasks found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.archive = (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true })
    .then(archivedTask => {
      if (archivedTask) {
        res.status(200).send(archivedTask)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.restore = (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { isArchived: false }, { new: true })
    .then(restoredTask => {
      if (restoredTask) {
        res.status(200).send(restoredTask)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.markComplete = (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { isCompleted: req.body.isCompleted }, { new: true })
    .then(completedTask => {
      if (completedTask) {
        res.status(200).send(completedTask)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}
