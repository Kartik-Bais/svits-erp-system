const Joi = require('joi')

const createComplaint = Joi.object({
  title:         Joi.string().min(5).max(100).required(),
  description:   Joi.string().min(10).max(1000).required(),
  category:      Joi.string().valid('Hostel', 'Academics', 'Transport', 'Infrastructure', 'Other').required(),
  priority:      Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  attachmentUrl: Joi.string().uri().allow('', null),
})

const updateComplaint = Joi.object({
  status:            Joi.string().valid('Pending', 'In Progress', 'Resolved', 'Rejected'),
  priority:          Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
  resolutionRemarks: Joi.string().max(500).allow('', null),
  isActive:          Joi.boolean(),
}).min(1)

module.exports = { createComplaint, updateComplaint }
