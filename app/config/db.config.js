const mongoose = require('mongoose')
require('dotenv').config()

exports.connect = async () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to the database!')
    })
    .catch(err => {
      console.log('Cannot connect to the database!', err)
      process.exit()
    })
}
