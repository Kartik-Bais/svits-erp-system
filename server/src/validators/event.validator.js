const Joi = require('joi')

const createEvent = Joi.object({
  title:       Joi.string().min(3).max(150).required(),
  description: Joi.string().min(10).required(),
  startDate:   Joi.date().iso().required(),
  endDate:     Joi.date().iso().min(Joi.ref('startDate')).required(),
  location:    Joi.string().min(3).max(200).required(),
  organizer:   Joi.string().hex().length(24).required(),
  bannerUrl:   Joi.string().uri().allow('', null),
  status:      Joi.string().valid('Upcoming', 'Ongoing', 'Completed', 'Cancelled').default('Upcoming'),
})

const updateEvent = Joi.object({
  title:       Joi.string().min(3).max(150),
  description: Joi.string().min(10),
  startDate:   Joi.date().iso(),
  endDate:     Joi.date().iso().min(Joi.ref('startDate')),
  location:    Joi.string().min(3).max(200),
  organizer:   Joi.string().hex().length(24),
  bannerUrl:   Joi.string().uri().allow('', null),
  status:      Joi.string().valid('Upcoming', 'Ongoing', 'Completed', 'Cancelled'),
  isActive:    Joi.boolean(),
}).min(1)

module.exports = { createEvent, updateEvent }
