const busPassService = require('../services/busPass.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBusPass = asyncHandler(async (req, res) => {
  const pass = await busPassService.createBusPass(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, pass))
})

const getBusPasses = asyncHandler(async (req, res) => {
  const { data, total } = await busPassService.getBusPasses(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getBusPassById = asyncHandler(async (req, res) => {
  const pass = await busPassService.getBusPassById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, pass))
})

const updateBusPass = asyncHandler(async (req, res) => {
  const pass = await busPassService.updateBusPass(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, pass))
})

const deleteBusPass = asyncHandler(async (req, res) => {
  await busPassService.deleteBusPass(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createBusPass,
  getBusPasses,
  getBusPassById,
  updateBusPass,
  deleteBusPass,
}
