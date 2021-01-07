const router = require('express').Router()
const User = require('../model/User.js')
const bcrypt = require('bcryptjs')
const verify = require('./verifyToken.js')
const jwt = require('jsonwebtoken')
const Analyze = require('../model/Analyze.js')
const multer = require('multer')
const { registerValidation, loginValidation } = require('../validation.js')

const upload = multer({
  limit: {
    fileSize: 1000000  // 1MB
  }
})

// register
// router.post('/register', async(req, res) => {
//   // validate before sending
//   const { error } = registerValidation(req.body)
//   if(error) return res.status(400).send(error.details[0].message)
  
//   //check duplicate email
//   const emailExist = await User.findOne({email: req.body.email})
//   if(emailExist) return res.status(400).send('email used')
  
//   // hash password
//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(req.body.password, salt)

//   // create user data
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: hashedPassword
//   }) 
//   try {
//     const savedUser = await user.save()
//     res.send({ user: user._id })
//   } catch (error) {
//     res.status(404).send(error)
//   }
// })

// login
router.post('/login', async(req, res) => {
  const { error } = loginValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  // check if email exist
  const user = await User.findOne({email: req.body.email})
  if(!user) return res.status(400).send('Invalid email or password')

  // password correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if(!validPassword) return res.status(400).send('Invalid email or password')

  // create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: 60*60})
  res.header('auth-token', token).send(token)
})


//get info
router.post('/getuser', verify, async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({_id: verified._id})
  console.log(user)
  res.status(200).send({
    name: user.name,
    email: user.email,
    image: user.avatar
  })
})

//upload avatar
router.post('/avatar', verify, upload.single('avatar'), async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  User.updateOne({_id: verified._id}, {avatar: req.file.buffer}, (err) => {
    if(err) {
      res.status(400).send(err)
    } else {
      res.status(200).send('avatar updated')
    }
  })
})

//get avatar
router.get('/avatar', verify, async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({_id: verified._id})
  res.send(user.avatar)
})
module.exports = router