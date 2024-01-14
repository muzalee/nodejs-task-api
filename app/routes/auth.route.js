const express = require('express')
const { register, login } = require('../controllers/auth.controller')
const { body } = require('express-validator')

const router = express.Router()

const registerValidationRules = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('password should be at least 6 characters long')
]

const loginValidationRules = [
  body('email').isEmail().withMessage('email must be valid'),
  body('password').notEmpty().withMessage('password is required')
]

router.post('/register', registerValidationRules, register)
router.post('/login', loginValidationRules, login)

module.exports = router
