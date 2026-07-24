const Joi = require('joi')

const createBusRoute = Joi.object({
  routeName:   Joi.string().min(3).max(100).required(),
  vehicleNo:   Joi.string().min(3).max(30).required(),
  driverName:  Joi.string().min(3).max(100).required(),
  driverPhone: Joi.string().max(20).allow('', null),
  stops:       Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      time: Joi.string().allow('', null)
    })
  ).min(1).required(),
  capacity:    Joi.number().min(1).required(),
})

const updateBusRoute = Joi.object({
  routeName:   Joi.string().min(3).max(100),
  vehicleNo:   Joi.string().min(3).max(30),
  driverName:  Joi.string().min(3).max(100),
  driverPhone: Joi.string().max(20).allow('', null),
  stops:       Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      time: Joi.string().allow('', null)
    })
  ).min(1),
  capacity:    Joi.number().min(1),
  isActive:    Joi.boolean(),
}).min(1)

module.exports = { createBusRoute, updateBusRoute }
