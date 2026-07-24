const Joi = require('joi')

const createAssignment = Joi.object({
  title:         Joi.string().min(3).max(150).required(),
  description:   Joi.string().min(5).max(2000).required(),
  subject:       Joi.string().hex().length(24).required(),
  faculty:       Joi.string().hex().length(24).required(),
  batch:         Joi.string().max(20).default('All'),
  deadline:      Joi.date().iso().required(),
  maxMarks:      Joi.number().min(1).max(100).default(10),
  attachmentUrl: Joi.string().uri().allow('', null),
})

const updateAssignment = Joi.object({
  title:         Joi.string().min(3).max(150),
  description:   Joi.string().min(5).max(2000),
  subject:       Joi.string().hex().length(24),
  faculty:       Joi.string().hex().length(24),
  batch:         Joi.string().max(20),
  deadline:      Joi.date().iso(),
  maxMarks:      Joi.number().min(1).max(100),
  attachmentUrl: Joi.string().uri().allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createAssignment, updateAssignment }
