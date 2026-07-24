const busRouteService = require('../services/busRoute.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBusRoute = asyncHandler(async (req, res) => {
  const route = await busRouteService.createBusRoute(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, route))
})

const getBusRoutes = asyncHandler(async (req, res) => {
  const { data, total } = await busRouteService.getBusRoutes(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getBusRouteById = asyncHandler(async (req, res) => {
  const route = await busRouteService.getBusRouteById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, route))
})

const updateBusRoute = asyncHandler(async (req, res) => {
  const route = await busRouteService.updateBusRoute(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, route))
})

const deleteBusRoute = asyncHandler(async (req, res) => {
  await busRouteService.deleteBusRoute(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createBusRoute,
  getBusRoutes,
  getBusRouteById,
  updateBusRoute,
  deleteBusRoute,
}
