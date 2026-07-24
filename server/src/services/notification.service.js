const Notification = require('../models/Notification.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createNotification = async (data) => {
  const user = await User.findById(data.user)
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')

  return Notification.create(data)
}

const getMyNotifications = async (userId, queryString) => {
  const features = new ApiFeatures(Notification.find({ user: userId }), queryString)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Notification.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const markAsRead = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, user: userId })
  if (!notification) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  notification.isRead = true
  await notification.save()
  return notification
}

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true })
}

const deleteNotification = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, user: userId })
  if (!notification) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  notification.isActive = false
  await notification.save()
  return notification
}

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}
