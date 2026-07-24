const Joi = require('joi')

const createSubmission = Joi.object({
  assignment: Joi.string().hex().length(24).required(),
  student:    Joi.string().hex().length(24).required(),
  fileUrl:    Joi.string().uri().required(),
})

const updateSubmission = Joi.object({
  fileUrl:       Joi.string().uri(),
  status:        Joi.string().valid('Submitted', 'Graded', 'Late'),
  marksObtained: Joi.number().min(0),
  feedback:      Joi.string().max(1000).allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createSubmission, updateSubmission }
