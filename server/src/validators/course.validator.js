const Joi = require('joi')

const createCourse = Joi.object({
  name:           Joi.string().min(2).max(100).required(),
  code:           Joi.string().min(2).max(20).uppercase().required(),
  department:     Joi.string().hex().length(24).required(),
  durationYears:  Joi.number().min(1).max(7).required(),
  totalSemesters: Joi.number().min(1).max(14).required(),
  description:    Joi.string().max(500).allow('', null),
})

const updateCourse = Joi.object({
  name:           Joi.string().min(2).max(100),
  code:           Joi.string().min(2).max(20).uppercase(),
  department:     Joi.string().hex().length(24),
  durationYears:  Joi.number().min(1).max(7),
  totalSemesters: Joi.number().min(1).max(14),
  description:    Joi.string().max(500).allow('', null),
  isActive:       Joi.boolean(),
}).min(1)

module.exports = { createCourse, updateCourse }
