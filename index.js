const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.use('/tasks', require('./tasks'))

app.use(router)
app.use((req, res) => {
  if (res.locals.promise) {
    res.locals.promise.then(
      data => {
        res.send(data)
      },
      err => {
        res.send(err)
      }
    )
  }
})

app.listen(PORT, () => {
    console.log('Listening on', PORT)
})
