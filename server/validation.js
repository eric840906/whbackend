const Joi = require('joi')

const registerValidation = (data) =>{
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const foodValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    calories: Joi.number().required(),
    protein: Joi.number().required(),
    carbo: Joi.number().required(),
    fat: Joi.number().required()
  })
  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.foodValidation = foodValidation
