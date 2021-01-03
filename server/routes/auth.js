const router = require('express').Router()
const User = require('../model/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Analyze = require('../model/Analyze.js')
const { registerValidation, loginValidation } = require('../validation.js')



// register
router.post('/register', async(req, res) => {
  // validate before sending
  const { error } = registerValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  
  //check duplicate email
  const emailExist = await User.findOne({email: req.body.email})
  if(emailExist) return res.status(400).send('email used')
  
  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // create user data
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  }) 
  try {
    const savedUser = await user.save()
    res.send({ user: user._id })
  } catch (error) {
    res.status(404).send(error)
  }
})

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
module.exports = router