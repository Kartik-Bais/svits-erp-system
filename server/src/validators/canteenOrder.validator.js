const Joi = require('joi')

const createCanteenOrder = Joi.object({
  items: Joi.array().items(
    Joi.object({
      item: Joi.string().hex().length(24).required(),
      quantity: Joi.number().min(1).required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('Cash', 'UPI', 'Card', 'Wallet').default('Cash'),
  specialInstructions: Joi.string().max(200).allow('', null),
})

const updateCanteenOrder = Joi.object({
  status: Joi.string().valid('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed', 'Refunded'),
  isActive: Joi.boolean(),
}).min(1)

module.exports = { createCanteenOrder, updateCanteenOrder }
