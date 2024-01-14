const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const db = require('./app/models')
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' })
})

const taskController = require('./app/controllers/task.controller')

app.post('/tasks', taskController.create)
app.get('/tasks', taskController.findAll)
app.get('/tasks/:id', taskController.findOne)
app.put('/tasks/:id', taskController.update)
app.delete('/tasks/:id', taskController.delete)
app.post('/tasks/:id/archive', taskController.archive)
app.post('/tasks/:id/restore', taskController.restore)
app.post('/tasks/:id/complete', taskController.markComplete)

// add not found custom message
app.use((req, res) => {
  res.status(404).send({ status: false, msg: 'Requested resource not found.' })
})
