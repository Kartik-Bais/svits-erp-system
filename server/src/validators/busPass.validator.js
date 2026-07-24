const Joi = require('joi')

const createBusPass = Joi.object({
  user:          Joi.string().hex().length(24).required(),
  route:         Joi.string().hex().length(24).required(),
  pickupStop:    Joi.string().min(3).max(100).required(),
  validityStart: Joi.date().iso().required(),
  validityEnd:   Joi.date().iso().min(Joi.ref('validityStart')).required(),
  feeAmount:     Joi.number().min(0).required(),
})

const updateBusPass = Joi.object({
  pickupStop:    Joi.string().min(3).max(100),
  validityStart: Joi.date().iso(),
  validityEnd:   Joi.date().iso().min(Joi.ref('validityStart')),
  status:        Joi.string().valid('Active', 'Expired', 'Cancelled', 'Pending'),
  feeAmount:     Joi.number().min(0),
  paymentStatus: Joi.string().valid('Pending', 'Paid'),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createBusPass, updateBusPass }
