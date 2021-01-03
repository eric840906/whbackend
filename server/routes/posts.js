const router = require('express').Router()
const verify = require('./verifyToken.js')
const jwt = require('jsonwebtoken')
const User = require('../model/User.js')
const Analyze = require('../model/Analyze.js')

router.post('/',verify , async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({_id: verified._id})
  console.log(user)
  const analyze = new Analyze({
    userID: user._id,
    todayInfo: req.body.todayInfo,
    date: req.body.date
  })
  try {
    const hasDate = await Analyze.findOne({userID: user._id, date: req.body.date})
    // console.log(hasDate)
    console.log('analyze=' + analyze)
    if(hasDate) Analyze.replaceOne(
      {userID: user._id, date: req.body.date},
      {
        userID: user._id,
        todayInfo: req.body.todayInfo,
        date: req.body.date
      },
      null,
      (err) => {
        if(err) {
          res.status(400).send(err)
        } else {
          res.status(200).send('updated')
        }
      })
    else {
      Analyze.countDocuments({userID: verified._id}, async(err, count) => {
        // 限制每個用戶最多10筆資料，超過會把最舊的刪除
        if(count === 10) {
          console.log('count=10')
          const oldestDoc = await Analyze.find({userID: verified._id}).sort({date: 1}).limit(1)
          const oldestDocID = oldestDoc[0]._id
          console.log('oldestDocID='+oldestDocID)
          Analyze.findOneAndDelete({ _id: oldestDocID }, (err, res) => {
            if(err) console.log('err'+ err)
            else console.log('res' + res)
          })
          const savedData = await analyze.save()
          res.send({ savedData })
        } else {
          const savedData = await analyze.save()
          res.send({ savedData })
        }
      })
    }
  } catch (error) {
    res.status(404).send(error)
  }
})

router.get('/',verify, async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const userAnalyze = await Analyze.find({userID: verified._id})
  res.status(200).send(userAnalyze)
  const analyzeCount = await Analyze.countDocuments({userID: verified._id}, (err, c) => console.log('counst='+c))
  const oldest = await Analyze.find({userID: verified._id}).sort({date: 1}).limit(1)
  console.log(oldest[0]._id)
  const newest = await Analyze.find({userID: verified._id}).sort({date: -1}).limit(1)
  console.log('newest '+newest)
})

module.exports = router