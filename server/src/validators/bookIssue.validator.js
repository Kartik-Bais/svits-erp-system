const Joi = require('joi')

const issueBook = Joi.object({
  book:    Joi.string().hex().length(24).required(),
  user:    Joi.string().hex().length(24).required(),
  dueDate: Joi.date().iso().min('now').required(), // Due date must be in the future
  remarks: Joi.string().max(200).allow('', null),
})

const returnBook = Joi.object({
  remarks: Joi.string().max(200).allow('', null),
})

const renewBook = Joi.object({
  newDueDate: Joi.date().iso().min('now').required(),
})

const updateBookIssue = Joi.object({
  status:   Joi.string().valid('Issued', 'Returned', 'Overdue'),
  remarks:  Joi.string().max(200).allow('', null),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { issueBook, returnBook, renewBook, updateBookIssue }
