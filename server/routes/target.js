const router = require('express').Router()
const Target = require('../model/Target.js')
const verify = require('./verifyToken.js')
const User = require('../model/User.js')
const jwt = require('jsonwebtoken')

router.post('/',verify , async (req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({_id: verified._id})
  console.log(user)
  const target = new Target ({
    userID: user._id,
    target: req.body.target
  })
  try {
    const hasUser = await Target.findOne({userID: user._id})
    if(hasUser) Target.replaceOne(
      {userID: user._id},
      {
        userID: user._id,
        target: req.body.target
      },
      null,
      (err) => {
        if(err) {
          res.status(400).send(err)
        } else {
          res.status(200).send(`target changed`)
        }
      })
    else {
      const savedTarget = await target.save()
      res.send(savedTarget)
    }
  } catch (error) {
    res.status(404).send(error)
  }
})

router.get('/', verify, async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const userTarget = await Target.findOne({userID: verified._id})
  console.log(userTarget)
  res.status(200).send(userTarget)
})

module.exports = router