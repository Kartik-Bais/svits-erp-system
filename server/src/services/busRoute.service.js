const BusRoute = require('../models/BusRoute.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBusRoute = async (data, userId) => {
  const exists = await BusRoute.findOne({ routeName: data.routeName })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Bus route with this name already exists')
  }

  return BusRoute.create({ ...data, createdBy: userId })
}

const getBusRoutes = async (queryString) => {
  const features = new ApiFeatures(BusRoute.find(), queryString)
    .filter()
    .search(['routeName', 'vehicleNo', 'driverName'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    BusRoute.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getBusRouteById = async (id) => {
  const route = await BusRoute.findById(id)
  if (!route) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return route
}

const updateBusRoute = async (id, data, userId) => {
  const route = await BusRoute.findById(id)
  if (!route) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.routeName) {
    const exists = await BusRoute.findOne({ _id: { $ne: id }, routeName: data.routeName })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Bus route with this name already exists')
  }

  const checkCap = data.capacity !== undefined ? data.capacity : route.capacity
  if (route.currentOccupancy > checkCap) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot decrease capacity below current occupancy')
  }

  Object.assign(route, { ...data, updatedBy: userId })
  await route.save()
  return route
}

const deleteBusRoute = async (id, userId) => {
  const route = await BusRoute.findById(id)
  if (!route) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (route.currentOccupancy > 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete route with active passes')
  }

  route.isActive = false
  route.updatedBy = userId
  await route.save()
  return route
}

module.exports = {
  createBusRoute,
  getBusRoutes,
  getBusRouteById,
  updateBusRoute,
  deleteBusRoute,
}
