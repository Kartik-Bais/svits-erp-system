const resultService = require('../services/result.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createResult = asyncHandler(async (req, res) => {
  if (Array.isArray(req.body)) {
    const result = await resultService.createBulkResult(req.body, req.user._id)
    return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Bulk results processed', { inserted: result.length }))
  }

  const result = await resultService.createResult(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, result))
})

const getResults = asyncHandler(async (req, res) => {
  const { data, total } = await resultService.getResults(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getResultById = asyncHandler(async (req, res) => {
  const result = await resultService.getResultById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, result))
})

const updateResult = asyncHandler(async (req, res) => {
  const result = await resultService.updateResult(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, result))
})

const deleteResult = asyncHandler(async (req, res) => {
  await resultService.deleteResult(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
}
