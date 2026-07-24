const Joi = require('joi')

const createFacultyProfile = Joi.object({
  user:            Joi.string().hex().length(24).required(),
  employeeId:      Joi.string().min(3).max(30).uppercase().required(),
  department:      Joi.string().hex().length(24).required(),
  designation:     Joi.string().max(100).required(),
  qualifications:  Joi.array().items(Joi.string()).default([]),
  joinedDate:      Joi.date().iso().required(),
  experienceYears: Joi.number().min(0).max(60).default(0),
  leaveBalance:    Joi.number().min(0).max(100).default(12),
  bloodGroup:      Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
  address:         Joi.string().max(500).allow('', null),
})

const updateFacultyProfile = Joi.object({
  employeeId:      Joi.string().min(3).max(30).uppercase(),
  department:      Joi.string().hex().length(24),
  designation:     Joi.string().max(100),
  qualifications:  Joi.array().items(Joi.string()),
  joinedDate:      Joi.date().iso(),
  experienceYears: Joi.number().min(0).max(60),
  leaveBalance:    Joi.number().min(0).max(100),
  bloodGroup:      Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
  address:         Joi.string().max(500).allow('', null),
  isActive:        Joi.boolean(),
}).min(1)

module.exports = { createFacultyProfile, updateFacultyProfile }
