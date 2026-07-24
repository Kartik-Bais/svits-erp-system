const Joi = require('joi')

const createHostelRoom = Joi.object({
  roomNo:         Joi.string().min(1).max(20).required(),
  block:          Joi.string().min(1).max(50).required(),
  capacity:       Joi.number().min(1).required(),
  type:           Joi.string().valid('AC', 'Non-AC').default('Non-AC'),
  feePerSemester: Joi.number().min(0).required(),
})

const updateHostelRoom = Joi.object({
  roomNo:         Joi.string().min(1).max(20),
  block:          Joi.string().min(1).max(50),
  capacity:       Joi.number().min(1),
  type:           Joi.string().valid('AC', 'Non-AC'),
  feePerSemester: Joi.number().min(0),
  isActive:       Joi.boolean(),
}).min(1)

module.exports = { createHostelRoom, updateHostelRoom }
