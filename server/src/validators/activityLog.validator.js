const Joi = require('joi')

const getActivityLogs = Joi.object({
  action: Joi.string(),
  resource: Joi.string(),
  status: Joi.string().valid('SUCCESS', 'FAILURE'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
})

module.exports = { getActivityLogs }
