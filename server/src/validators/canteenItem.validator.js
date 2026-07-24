const Joi = require('joi')

const createCanteenItem = Joi.object({
  name:        Joi.string().min(2).max(100).required(),
  category:    Joi.string().valid('Snacks', 'Beverages', 'Meals', 'Desserts', 'Other').required(),
  price:       Joi.number().min(0).required(),
  description: Joi.string().max(200).allow('', null),
  imageUrl:    Joi.string().uri().allow('', null),
})

const updateCanteenItem = Joi.object({
  name:        Joi.string().min(2).max(100),
  category:    Joi.string().valid('Snacks', 'Beverages', 'Meals', 'Desserts', 'Other'),
  price:       Joi.number().min(0),
  description: Joi.string().max(200).allow('', null),
  imageUrl:    Joi.string().uri().allow('', null),
  isAvailable: Joi.boolean(),
  isActive:    Joi.boolean(),
}).min(1)

module.exports = { createCanteenItem, updateCanteenItem }
