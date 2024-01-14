const Task = require('../models').tasks

exports.create = (req, res) => {
  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority
  })

  newTask.save()
    .then(result => {
      res.status(201).send(result)
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.findAll = (req, res) => {
  Task.find({ isArchived: false })
    .then(tasks => {
      if (tasks) {
        res.status(200).send(tasks)
      } else {
        res.status(404).send({ message: 'No tasks found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.findOne = (req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      if (task) {
        res.status(200).send(task)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedTask => {
      if (updatedTask) {
        res.status(200).send(updatedTask)
      } else {
        res.status(404).send({ message: 'Task not found.' })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

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

exports.deleteAll = (req, res) => {
  Task.remove({})
    .then(deletedTasks => {
      if (deletedTasks) {
        res.status(200).send(deletedTasks)
      } else {
        res.status(404).send({ message: 'No tasks found.' })
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
