const gatePassService = require('../services/gatePass.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createGatePass = asyncHandler(async (req, res) => {
  const gatePass = await gatePassService.createGatePass(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, gatePass))
})

const getGatePasses = asyncHandler(async (req, res) => {
  const { data, total } = await gatePassService.getGatePasses(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getGatePassById = asyncHandler(async (req, res) => {
  const gatePass = await gatePassService.getGatePassById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, gatePass))
})

const updateGatePass = asyncHandler(async (req, res) => {
  const gatePass = await gatePassService.updateGatePass(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, gatePass))
})

const deleteGatePass = asyncHandler(async (req, res) => {
  await gatePassService.deleteGatePass(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createGatePass,
  getGatePasses,
  getGatePassById,
  updateGatePass,
  deleteGatePass,
}
