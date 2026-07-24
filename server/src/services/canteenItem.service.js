const CanteenItem = require('../models/CanteenItem.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createCanteenItem = async (data, userId) => {
  const exists = await CanteenItem.findOne({ name: data.name })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Item with this name already exists')
  }

  return CanteenItem.create({ ...data, createdBy: userId })
}

const getCanteenItems = async (queryString) => {
  const features = new ApiFeatures(CanteenItem.find(), queryString)
    .filter()
    .search(['name', 'category'])
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    CanteenItem.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getCanteenItemById = async (id) => {
  const item = await CanteenItem.findById(id)
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return item
}

const updateCanteenItem = async (id, data, userId) => {
  const item = await CanteenItem.findById(id)
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.name) {
    const exists = await CanteenItem.findOne({ _id: { $ne: id }, name: data.name })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Item with this name already exists')
  }

  Object.assign(item, { ...data, updatedBy: userId })
  await item.save()
  return item
}

const deleteCanteenItem = async (id, userId) => {
  const item = await CanteenItem.findById(id)
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  item.isActive = false
  item.updatedBy = userId
  await item.save()
  return item
}

module.exports = {
  createCanteenItem,
  getCanteenItems,
  getCanteenItemById,
  updateCanteenItem,
  deleteCanteenItem,
}
