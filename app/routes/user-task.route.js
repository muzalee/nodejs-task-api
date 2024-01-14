const express = require('express')
const { authenticate } = require('../middlewares/auth.middleware')
const taskController = require('../controllers/user-task.controller')

const router = express.Router()

router.post('/', authenticate, taskController.create)
router.get('/', authenticate, taskController.findAll)
router.get('/:id', authenticate, taskController.findOne)
router.put('/:id', authenticate, taskController.update)
router.delete('/:id', authenticate, taskController.delete)
router.post('/:id/archive', authenticate, taskController.archive)
router.post('/:id/restore', authenticate, taskController.restore)
router.post('/:id/complete', authenticate, taskController.markComplete)

module.exports = router
