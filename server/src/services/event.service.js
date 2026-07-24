const Event = require('../models/Event.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createEvent = async (data, userId) => {
  const organizer = await User.findById(data.organizer)
  if (!organizer) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Organizer not found')

  return Event.create({ ...data, createdBy: userId })
}

const getEvents = async (queryString) => {
  const features = new ApiFeatures(
    Event.find().populate('organizer', 'name email role'),
    queryString
  )
    .filter()
    .search(['title', 'location'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Event.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getEventById = async (id) => {
  const event = await Event.findById(id).populate('organizer', 'name email role')
  if (!event) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return event
}

const updateEvent = async (id, data, userId) => {
  const event = await Event.findById(id)
  if (!event) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.organizer) {
    const organizer = await User.findById(data.organizer)
    if (!organizer) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Organizer not found')
  }

  Object.assign(event, { ...data, updatedBy: userId })
  await event.save()
  return event
}

const deleteEvent = async (id, userId) => {
  const event = await Event.findById(id)
  if (!event) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  event.isActive = false
  event.updatedBy = userId
  await event.save()
  return event
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
}
