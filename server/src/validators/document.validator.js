const Joi = require('joi')

const createDocument = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  documentType: Joi.string().valid('Resume', 'Certificate', 'Assignment', 'IDProof', 'Other').default('Other'),
  associatedModel: Joi.string().max(50).allow('', null),
  associatedId: Joi.string().hex().length(24).allow(null),
})

const updateDocument = Joi.object({
  title: Joi.string().min(3).max(100),
  documentType: Joi.string().valid('Resume', 'Certificate', 'Assignment', 'IDProof', 'Other'),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createDocument, updateDocument }
