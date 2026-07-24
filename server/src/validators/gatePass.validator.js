const Joi = require('joi')

const createGatePass = Joi.object({
  reason:         Joi.string().min(5).max(200).required(),
  outTime:        Joi.date().iso().min('now').required(),
  expectedInTime: Joi.date().iso().min(Joi.ref('outTime')).required(),
})

const updateGatePass = Joi.object({
  status:       Joi.string().valid('Pending', 'Approved', 'Rejected', 'Out', 'Returned'),
  actualInTime: Joi.date().iso().allow(null),
  isActive:     Joi.boolean(),
}).min(1)

module.exports = { createGatePass, updateGatePass }
