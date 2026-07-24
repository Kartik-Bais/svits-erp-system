const Joi = require('joi')

const createLostAndFound = Joi.object({
  type:        Joi.string().valid('Lost', 'Found').required(),
  itemName:    Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).max(500).required(),
  location:    Joi.string().min(3).max(100).required(),
  date:        Joi.date().iso().max('now').required(),
  imageUrl:    Joi.string().uri().allow('', null),
})

const updateLostAndFound = Joi.object({
  status:    Joi.string().valid('Open', 'Claimed', 'Resolved'),
  claimedBy: Joi.string().hex().length(24).allow(null),
  isActive:  Joi.boolean(),
}).min(1)

module.exports = { createLostAndFound, updateLostAndFound }
