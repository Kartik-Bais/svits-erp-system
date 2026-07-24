const CanteenOrder = require('../models/CanteenOrder.model')
const CanteenItem = require('../models/CanteenItem.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createCanteenOrder = async (data, userId) => {
  let totalAmount = 0
  const orderItems = []

  // Fetch prices and validate availability
  for (const itemInput of data.items) {
    const item = await CanteenItem.findById(itemInput.item)
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `Item with ID ${itemInput.item} not found`)
    }
    if (!item.isAvailable) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Item ${item.name} is currently unavailable`)
    }

    orderItems.push({
      item: item._id,
      quantity: itemInput.quantity,
      price: item.price
    })
    totalAmount += item.price * itemInput.quantity
  }

  data.items = orderItems
  data.totalAmount = totalAmount
  data.user = userId

  return CanteenOrder.create(data)
}

const getCanteenOrders = async (queryString) => {
  const features = new ApiFeatures(
    CanteenOrder.find()
      .populate('user', 'name email role')
      .populate('items.item', 'name category imageUrl'),
    queryString
  )
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    CanteenOrder.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getCanteenOrderById = async (id) => {
  const order = await CanteenOrder.findById(id)
    .populate('user', 'name email role')
    .populate('items.item', 'name category imageUrl price')
  
  if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return order
}

const updateCanteenOrder = async (id, data) => {
  const order = await CanteenOrder.findById(id)
  if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  Object.assign(order, data)
  await order.save()
  return order
}

const deleteCanteenOrder = async (id) => {
  const order = await CanteenOrder.findById(id)
  if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  order.isActive = false
  await order.save()
  return order
}

module.exports = {
  createCanteenOrder,
  getCanteenOrders,
  getCanteenOrderById,
  updateCanteenOrder,
  deleteCanteenOrder,
}
