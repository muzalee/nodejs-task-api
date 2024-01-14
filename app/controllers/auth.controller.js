const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const { validationResult } = require('express-validator')

const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() })
  }

  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 8)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '8 hour'
    })

    const decodedToken = jwt.decode(token)
    const expiryDate = decodedToken.exp * 1000

    res.status(200).send({ status: true, data: { token, expiryDate } })
  } catch (err) {
    res.status(500).send({ status: false, msg: err })
  }
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ status: false, msg: 'Incorrect password' })
    }

    const passwordMatch = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({ status: false, msg: 'Incorrect password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '8 hour'
    })

    const decodedToken = jwt.decode(token)
    const expiryDate = decodedToken.exp * 1000

    res.status(200).send({ status: true, data: { token, expiryDate } })
  } catch (err) {
    res.status(500).send({ status: false, msg: err })
  }
}

module.exports = { register, login }
