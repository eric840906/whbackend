const router = require('express').Router()
const FoodList = require('../model/FoodList.js')
const verify = require('./verifyToken.js')
const { foodValidation } = require('../validation.js')

router.post('/',verify, async(req, res) => {
  // check duplicated food
  const foodExist = await FoodList.findOne({name: req.body.name})
  if(foodExist) return res.status(400).send('Food already exists')

  const { error } = foodValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const foodInfo = await new FoodList ({
    name: req.body.name,
    calories: req.body.calories,
    protein: req.body.protein,
    carbo: req.body.carbo,
    fat: req.body.fat
  })
  res.send(foodInfo)
  try {
    const saveFood = await foodInfo.save()
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/', async(req, res) => {
  const allFood = await FoodList.find({})
  res.send(allFood)
})
module.exports = router

