const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const User = mongoose.model('user', schema)

module.exports = User
