const Joi = require('joi')

const createBookmark = Joi.object({
  resourceType: Joi.string().valid('Notice', 'Event', 'Book').required(),
  resourceId: Joi.string().hex().length(24).required(),
})

module.exports = { createBookmark }
