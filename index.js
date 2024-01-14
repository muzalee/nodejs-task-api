const express = require('express')
const bodyParser = require('body-parser')
const db = require('./app/config/db.config')
const taskRoutes = require('./app/routes/task.route')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: process.env.MONGODB_URI
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

db.connect()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' })
})

app.use('/tasks', taskRoutes)

// add not found custom message
app.use((req, res) => {
  res.status(404).send({ status: false, msg: 'Requested resource not found.' })
})
