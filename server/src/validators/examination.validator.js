const Joi = require('joi')

const createExamination = Joi.object({
  name:      Joi.string().min(3).max(100).required(),
  course:    Joi.string().hex().length(24).required(),
  semester:  Joi.string().hex().length(24).required(),
  startDate: Joi.date().iso().required(),
  endDate:   Joi.date().iso().min(Joi.ref('startDate')).required(),
  type:      Joi.string().valid('Midterm', 'Final', 'Practical', 'Unit Test').default('Final'),
  status:    Joi.string().valid('Upcoming', 'Ongoing', 'Completed').default('Upcoming'),
})

const updateExamination = Joi.object({
  name:      Joi.string().min(3).max(100),
  course:    Joi.string().hex().length(24),
  semester:  Joi.string().hex().length(24),
  startDate: Joi.date().iso(),
  endDate:   Joi.date().iso().min(Joi.ref('startDate')),
  type:      Joi.string().valid('Midterm', 'Final', 'Practical', 'Unit Test'),
  status:    Joi.string().valid('Upcoming', 'Ongoing', 'Completed'),
  isActive:  Joi.boolean(),
}).min(1)

module.exports = { createExamination, updateExamination }
