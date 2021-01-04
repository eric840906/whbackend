const mongoose = require('mongoose')

const targetSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  target: {
    type: Object,
    required: true
  }
})

module.exports = mongoose.model('Target', targetSchema)