const Joi = require('joi')

const createNotice = Joi.object({
  title:          Joi.string().min(3).max(150).required(),
  content:        Joi.string().min(10).required(),
  targetAudience: Joi.string().valid('All', 'Student', 'Faculty', 'Staff').default('All'),
  department:     Joi.string().hex().length(24).allow(null),
  attachmentUrl:  Joi.string().uri().allow('', null),
  isImportant:    Joi.boolean().default(false),
  expiresAt:      Joi.date().iso().min('now').allow(null),
})

const updateNotice = Joi.object({
  title:          Joi.string().min(3).max(150),
  content:        Joi.string().min(10),
  targetAudience: Joi.string().valid('All', 'Student', 'Faculty', 'Staff'),
  department:     Joi.string().hex().length(24).allow(null),
  attachmentUrl:  Joi.string().uri().allow('', null),
  isImportant:    Joi.boolean(),
  expiresAt:      Joi.date().iso().min('now').allow(null),
  isActive:       Joi.boolean(),
}).min(1)

module.exports = { createNotice, updateNotice }
