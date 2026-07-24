const MessMenu = require('../models/MessMenu.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createMessMenu = async (data, userId) => {
  const exists = await MessMenu.findOne({ day: data.day })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, `Mess menu for ${data.day} already exists`)
  }

  return MessMenu.create({ ...data, createdBy: userId })
}

const getMessMenus = async (queryString) => {
  const features = new ApiFeatures(MessMenu.find(), queryString)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    MessMenu.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getMessMenuById = async (id) => {
  const menu = await MessMenu.findById(id)
  if (!menu) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return menu
}

const updateMessMenu = async (id, data, userId) => {
  const menu = await MessMenu.findById(id)
  if (!menu) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.day) {
    const exists = await MessMenu.findOne({ _id: { $ne: id }, day: data.day })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, `Mess menu for ${data.day} already exists`)
  }

  Object.assign(menu, { ...data, updatedBy: userId })
  await menu.save()
  return menu
}

const deleteMessMenu = async (id, userId) => {
  const menu = await MessMenu.findById(id)
  if (!menu) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  menu.isActive = false
  menu.updatedBy = userId
  await menu.save()
  return menu
}

module.exports = {
  createMessMenu,
  getMessMenus,
  getMessMenuById,
  updateMessMenu,
  deleteMessMenu,
}
