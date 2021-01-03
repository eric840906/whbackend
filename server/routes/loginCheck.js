const router = require('express').Router()
const verify = require('./verifyToken.js')

router.post('/',verify ,(req, res) => {
  res.status(200).send('success')
})

module.exports = router