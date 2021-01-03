const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const foodList = require('./routes/foodList.js')
const auth = require('./routes/auth.js')
const posts = require('./routes/posts.js')
const check = require('./routes/loginCheck.js')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

//DB connection
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {console.log('db connected')}
)

// middleware
app.use(bodyParser.json())
app.use(cors())
app.use('/api/foodlist', foodList)
app.use('/api/auth', auth)
app.use('/api/posts', posts)
app.use('/api/check', check)


const port = process.env.PORT || 5000

app.listen(port, () => { console.log(`server listening to http://localhost:${port}`) })