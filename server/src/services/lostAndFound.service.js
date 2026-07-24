const LostAndFound = require('../models/LostAndFound.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLostAndFound = async (data, userId) => {
  data.reportedBy = userId
  return LostAndFound.create(data)
}

const getLostAndFounds = async (queryString) => {
  const features = new ApiFeatures(
    LostAndFound.find()
      .populate('reportedBy', 'name email role')
      .populate('claimedBy', 'name email'),
    queryString
  )
    .filter()
    .search(['itemName', 'description', 'location'])
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    LostAndFound.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getLostAndFoundById = async (id) => {
  const item = await LostAndFound.findById(id)
    .populate('reportedBy', 'name email role')
    .populate('claimedBy', 'name email')
  
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return item
}

const updateLostAndFound = async (id, data) => {
  const item = await LostAndFound.findById(id)
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  Object.assign(item, data)
  await item.save()
  return item
}

const deleteLostAndFound = async (id) => {
  const item = await LostAndFound.findById(id)
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  item.isActive = false
  await item.save()
  return item
}

module.exports = {
  createLostAndFound,
  getLostAndFounds,
  getLostAndFoundById,
  updateLostAndFound,
  deleteLostAndFound,
}
