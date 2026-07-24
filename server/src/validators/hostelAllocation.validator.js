const Joi = require('joi')

const createHostelAllocation = Joi.object({
  user:       Joi.string().hex().length(24).required(),
  room:       Joi.string().hex().length(24).required(),
  joinedDate: Joi.date().iso().required(),
  remarks:    Joi.string().max(200).allow('', null),
})

const updateHostelAllocation = Joi.object({
  leftDate:      Joi.date().iso().min(Joi.ref('joinedDate')).allow(null),
  status:        Joi.string().valid('Allocated', 'Vacated'),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Partial'),
  remarks:       Joi.string().max(200).allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createHostelAllocation, updateHostelAllocation }
