const Joi = require('joi')

const createSemester = Joi.object({
  number: Joi.number().min(1).max(14).required(),
  course: Joi.string().hex().length(24).required(),
  year:   Joi.number().min(1).required(),
})

const updateSemester = Joi.object({
  number:   Joi.number().min(1).max(14),
  course:   Joi.string().hex().length(24),
  year:     Joi.number().min(1),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createSemester, updateSemester }
