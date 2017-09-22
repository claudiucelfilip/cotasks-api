const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

mongoose.connect('mongodb://cotasks:lola@ds143734.mlab.com:43734/cotasks', {
  useMongoClient: true
})
mongoose.Promise = Promise

const TaskSchema = new Schema({
  name: String,
  description: String,
  frequency: Number,
  done: Boolean,
  dueDate: Date,
  startDate: Date,
  color: String,
  meta: Object
})

const Task = mongoose.model('task', TaskSchema, 'tasks')

const router = require('express').Router()
router.get('/', (req, res, next) => {
  res.locals.promise = Task.find({})
  next()
})

router.get('/:id', () => {
  console.log('get by id')
})

function makeTasks (payload, count) {
  let tasks = []

  while (count--) {
    tasks.push(Object.assign({}, payload, {
      dueDate: moment(payload.startDate).add(count * payload.frequency, 'days').toDate()
    }))
  }
  return tasks
}

router.post('/', (req, res, next) => {
  let payload = Object.assign({}, req.body, {
    done: false,
    meta: {}
  })

  res.locals.promise = Task.insertMany(makeTasks(payload, 10))
  next()
})

router.put('/:id', (req, res, next) => {
  res.locals.promise = Task.findOneAndUpdate({ '_id': req.params.id }, req.body)
  next()
})

router.delete('/:id', (req, res, next) => {
  res.locals.promise = Task.deleteOne({ '_id': req.params.id })
  next()
})

module.exports = router
