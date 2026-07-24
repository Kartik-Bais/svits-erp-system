const Joi = require('joi')

const createSavedFilter = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  resourceType: Joi.string().min(2).max(50).required(),
  filterQuery: Joi.object().required(),
})

module.exports = { createSavedFilter }
