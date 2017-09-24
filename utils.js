
const router = require('express').Router()
router.get('/keepalive', (req, res, next) => {
  res.send(200)
})

module.exports = router
