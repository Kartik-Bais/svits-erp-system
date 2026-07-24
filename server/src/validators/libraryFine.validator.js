const Joi = require('joi')

const createLibraryFine = Joi.object({
  user:      Joi.string().hex().length(24).required(),
  bookIssue: Joi.string().hex().length(24).required(),
  amount:    Joi.number().min(0).required(),
  remarks:   Joi.string().max(200).allow('', null),
})

const updateLibraryFine = Joi.object({
  amount:        Joi.number().min(0),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Waived'),
  remarks:       Joi.string().max(200).allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createLibraryFine, updateLibraryFine }
