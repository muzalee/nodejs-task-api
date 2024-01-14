const express = require('express')
const taskController = require('../controllers/task.controller')

const router = express.Router()

router.post('/', taskController.create)
router.get('/', taskController.findAll)
router.get('/:id', taskController.findOne)
router.put('/:id', taskController.update)
router.delete('/:id', taskController.delete)
router.post('/:id/archive', taskController.archive)
router.post('/:id/restore', taskController.restore)
router.post('/:id/complete', taskController.markComplete)

module.exports = router
