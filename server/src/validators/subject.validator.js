const Joi = require('joi')

const createSubject = Joi.object({
  name:     Joi.string().min(2).max(100).required(),
  code:     Joi.string().min(2).max(20).uppercase().required(),
  course:   Joi.string().hex().length(24).required(),
  semester: Joi.string().hex().length(24).required(),
  credits:  Joi.number().min(1).max(10).required(),
  type:     Joi.string().valid('Theory', 'Lab', 'Project', 'Seminar').default('Theory'),
})

const updateSubject = Joi.object({
  name:     Joi.string().min(2).max(100),
  code:     Joi.string().min(2).max(20).uppercase(),
  course:   Joi.string().hex().length(24),
  semester: Joi.string().hex().length(24),
  credits:  Joi.number().min(1).max(10),
  type:     Joi.string().valid('Theory', 'Lab', 'Project', 'Seminar'),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createSubject, updateSubject }
