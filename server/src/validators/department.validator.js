const Joi = require('joi')

const createDepartment = Joi.object({
  name:        Joi.string().min(2).max(100).required(),
  code:        Joi.string().min(2).max(20).uppercase().required(),
  description: Joi.string().max(500).allow('', null),
  hod:         Joi.string().hex().length(24).allow(null),
})

const updateDepartment = Joi.object({
  name:        Joi.string().min(2).max(100),
  code:        Joi.string().min(2).max(20).uppercase(),
  description: Joi.string().max(500).allow('', null),
  hod:         Joi.string().hex().length(24).allow(null),
  isActive:    Joi.boolean(),
}).min(1)

module.exports = { createDepartment, updateDepartment }
