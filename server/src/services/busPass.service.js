const BusPass = require('../models/BusPass.model')
const BusRoute = require('../models/BusRoute.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBusPass = async (data, userId) => {
  const [user, route] = await Promise.all([
    User.findById(data.user),
    BusRoute.findById(data.route)
  ])

  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  if (!route) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Route not found')

  // Check if active pass already exists for this user
  const existingPass = await BusPass.findOne({ user: user._id, status: { $in: ['Active', 'Pending'] } })
  if (existingPass) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User already has an active or pending bus pass')
  }

  // We do not increment route occupancy here. It will be incremented when the pass status becomes 'Active'
  
  return BusPass.create({ ...data, createdBy: userId })
}

const getBusPasses = async (queryString) => {
  const features = new ApiFeatures(
    BusPass.find()
      .populate('user', 'name email role')
      .populate('route', 'routeName vehicleNo'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    BusPass.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getBusPassById = async (id) => {
  const pass = await BusPass.findById(id)
    .populate('user', 'name email role')
    .populate('route', 'routeName vehicleNo')
  
  if (!pass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return pass
}

const updateBusPass = async (id, data, userId) => {
  const pass = await BusPass.findById(id).populate('route')
  if (!pass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  // Handle route capacity if status changes to Active
  if (data.status === 'Active' && pass.status !== 'Active') {
    const route = await BusRoute.findById(pass.route._id)
    if (route.currentOccupancy >= route.capacity) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Bus route has reached maximum capacity')
    }
    route.currentOccupancy += 1
    await route.save()
  }

  // Handle route capacity if status changes from Active to Expired/Cancelled
  if (pass.status === 'Active' && data.status && data.status !== 'Active') {
    const route = await BusRoute.findById(pass.route._id)
    if (route && route.currentOccupancy > 0) {
      route.currentOccupancy -= 1
      await route.save()
    }
  }

  Object.assign(pass, { ...data, updatedBy: userId })
  await pass.save()
  return pass
}

const deleteBusPass = async (id, userId) => {
  const pass = await BusPass.findById(id)
  if (!pass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (pass.status === 'Active') {
    const route = await BusRoute.findById(pass.route)
    if (route && route.currentOccupancy > 0) {
      route.currentOccupancy -= 1
      await route.save()
    }
  }

  pass.isActive = false
  pass.updatedBy = userId
  await pass.save()
  return pass
}

module.exports = {
  createBusPass,
  getBusPasses,
  getBusPassById,
  updateBusPass,
  deleteBusPass,
}
