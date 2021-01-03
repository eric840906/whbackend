const { number } = require('joi')
const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbo: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('FoodList', foodSchema)