const Joi = require('joi')

const createStudentProfile = Joi.object({
  user:            Joi.string().hex().length(24).required(),
  enrollmentNo:    Joi.string().min(5).max(30).uppercase().required(),
  batchYear:       Joi.number().min(2000).max(2100).required(),
  department:      Joi.string().hex().length(24).required(),
  course:          Joi.string().hex().length(24).required(),
  currentSemester: Joi.string().hex().length(24).required(),
  section:         Joi.string().max(10).allow('', null),
  guardianName:    Joi.string().max(100).allow('', null),
  guardianPhone:   Joi.string().max(20).allow('', null),
  bloodGroup:      Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
  address:         Joi.string().max(500).allow('', null),
})

const updateStudentProfile = Joi.object({
  enrollmentNo:    Joi.string().min(5).max(30).uppercase(),
  batchYear:       Joi.number().min(2000).max(2100),
  department:      Joi.string().hex().length(24),
  course:          Joi.string().hex().length(24),
  currentSemester: Joi.string().hex().length(24),
  section:         Joi.string().max(10).allow('', null),
  guardianName:    Joi.string().max(100).allow('', null),
  guardianPhone:   Joi.string().max(20).allow('', null),
  bloodGroup:      Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
  address:         Joi.string().max(500).allow('', null),
  isActive:        Joi.boolean(),
}).min(1)

module.exports = { createStudentProfile, updateStudentProfile }
