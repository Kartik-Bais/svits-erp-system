const Joi = require('joi')

const createLeaveRequest = Joi.object({
  leaveType:     Joi.string().valid('Sick', 'Casual', 'Earned', 'Maternity', 'Other').required(),
  startDate:     Joi.date().iso().required(),
  endDate:       Joi.date().iso().min(Joi.ref('startDate')).required(),
  reason:        Joi.string().min(5).max(500).required(),
  attachmentUrl: Joi.string().uri().allow('', null),
})

const updateLeaveRequest = Joi.object({
  status:        Joi.string().valid('Pending', 'Approved', 'Rejected'),
  remarks:       Joi.string().max(200).allow('', null),
  isActive:      Joi.boolean(),
}).min(1)

module.exports = { createLeaveRequest, updateLeaveRequest }
