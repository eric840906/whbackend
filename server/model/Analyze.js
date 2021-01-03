const mongoose = require('mongoose')

const analyzeSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  todayInfo: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Analyze', analyzeSchema)