const Joi = require('joi')

const createAttendance = Joi.object({
  student: Joi.string().hex().length(24).required(),
  subject: Joi.string().hex().length(24).required(),
  faculty: Joi.string().hex().length(24).required(),
  date:    Joi.date().iso().required(),
  status:  Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required(),
  remarks: Joi.string().max(200).allow('', null),
})

// Often attendance is marked in bulk
const createBulkAttendance = Joi.array().items(createAttendance).min(1).max(200)

const updateAttendance = Joi.object({
  status:  Joi.string().valid('Present', 'Absent', 'Late', 'Excused'),
  remarks: Joi.string().max(200).allow('', null),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createAttendance, createBulkAttendance, updateAttendance }
