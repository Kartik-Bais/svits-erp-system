const Joi = require('joi')

const createNotification = Joi.object({
  user:    Joi.string().hex().length(24).required(),
  title:   Joi.string().min(3).max(100).required(),
  message: Joi.string().min(5).max(500).required(),
  type:    Joi.string().valid('Info', 'Alert', 'Success', 'Warning').default('Info'),
  link:    Joi.string().uri().allow('', null),
})

const updateNotification = Joi.object({
  isRead:   Joi.boolean(),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createNotification, updateNotification }
