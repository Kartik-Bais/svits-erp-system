const Joi = require('joi')

const createResult = Joi.object({
  student:       Joi.string().hex().length(24).required(),
  examination:   Joi.string().hex().length(24).required(),
  subject:       Joi.string().hex().length(24).required(),
  marksObtained: Joi.number().min(0).required(),
  maxMarks:      Joi.number().min(1).default(100),
  grade:         Joi.string().valid('O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', 'AB').required(),
  remarks:       Joi.string().max(200).allow('', null),
})

const createBulkResult = Joi.array().items(createResult).min(1).max(200)

const updateResult = Joi.object({
  marksObtained: Joi.number().min(0),
  maxMarks:      Joi.number().min(1),
  grade:         Joi.string().valid('O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', 'AB'),
  remarks:       Joi.string().max(200).allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createResult, createBulkResult, updateResult }
