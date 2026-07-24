const Joi = require('joi')

const createBook = Joi.object({
  title:           Joi.string().min(2).max(200).required(),
  author:          Joi.string().min(2).max(100).required(),
  isbn:            Joi.string().min(5).max(30).required(),
  publisher:       Joi.string().max(100).allow('', null),
  edition:         Joi.string().max(50).allow('', null),
  category:        Joi.string().max(100).allow('', null),
  totalCopies:     Joi.number().min(0).required(),
  availableCopies: Joi.number().min(0).max(Joi.ref('totalCopies')).required(),
  location:        Joi.string().max(100).allow('', null),
  coverImageUrl:   Joi.string().uri().allow('', null),
})

const updateBook = Joi.object({
  title:           Joi.string().min(2).max(200),
  author:          Joi.string().min(2).max(100),
  isbn:            Joi.string().min(5).max(30),
  publisher:       Joi.string().max(100).allow('', null),
  edition:         Joi.string().max(50).allow('', null),
  category:        Joi.string().max(100).allow('', null),
  totalCopies:     Joi.number().min(0),
  availableCopies: Joi.number().min(0), // Validation against totalCopies handled in service during update
  location:        Joi.string().max(100).allow('', null),
  coverImageUrl:   Joi.string().uri().allow('', null),
  isActive:        Joi.boolean(),
}).min(1)

module.exports = { createBook, updateBook }
