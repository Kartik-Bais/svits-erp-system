const Joi = require('joi')

const createMessMenu = Joi.object({
  day:       Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  breakfast: Joi.string().max(200).allow('', null),
  lunch:     Joi.string().max(200).allow('', null),
  snacks:    Joi.string().max(200).allow('', null),
  dinner:    Joi.string().max(200).allow('', null),
})

const updateMessMenu = Joi.object({
  day:       Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  breakfast: Joi.string().max(200).allow('', null),
  lunch:     Joi.string().max(200).allow('', null),
  snacks:    Joi.string().max(200).allow('', null),
  dinner:    Joi.string().max(200).allow('', null),
  isActive:  Joi.boolean(),
}).min(1)

module.exports = { createMessMenu, updateMessMenu }
