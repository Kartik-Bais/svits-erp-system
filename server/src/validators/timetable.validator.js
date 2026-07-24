const Joi = require('joi')

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const createTimetable = Joi.object({
  course:    Joi.string().hex().length(24).required(),
  semester:  Joi.string().hex().length(24).required(),
  section:   Joi.string().max(10).default('A'),
  subject:   Joi.string().hex().length(24).required(),
  faculty:   Joi.string().hex().length(24).required(),
  dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  startTime: Joi.string().pattern(timeRegex).required().messages({ 'string.pattern.base': 'Start time must be HH:MM format' }),
  endTime:   Joi.string().pattern(timeRegex).required().messages({ 'string.pattern.base': 'End time must be HH:MM format' }),
  room:      Joi.string().max(50).required(),
})

const updateTimetable = Joi.object({
  course:    Joi.string().hex().length(24),
  semester:  Joi.string().hex().length(24),
  section:   Joi.string().max(10),
  subject:   Joi.string().hex().length(24),
  faculty:   Joi.string().hex().length(24),
  dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  startTime: Joi.string().pattern(timeRegex).messages({ 'string.pattern.base': 'Start time must be HH:MM format' }),
  endTime:   Joi.string().pattern(timeRegex).messages({ 'string.pattern.base': 'End time must be HH:MM format' }),
  room:      Joi.string().max(50),
  isActive:  Joi.boolean(),
}).min(1)

module.exports = { createTimetable, updateTimetable }
