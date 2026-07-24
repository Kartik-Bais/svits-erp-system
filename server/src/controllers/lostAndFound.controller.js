const lostAndFoundService = require('../services/lostAndFound.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLostAndFound = asyncHandler(async (req, res) => {
  const item = await lostAndFoundService.createLostAndFound(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, item))
})

const getLostAndFounds = asyncHandler(async (req, res) => {
  const { data, total } = await lostAndFoundService.getLostAndFounds(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getLostAndFoundById = asyncHandler(async (req, res) => {
  const item = await lostAndFoundService.getLostAndFoundById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, item))
})

const updateLostAndFound = asyncHandler(async (req, res) => {
  const item = await lostAndFoundService.updateLostAndFound(req.params.id, req.body)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, item))
})

const deleteLostAndFound = asyncHandler(async (req, res) => {
  await lostAndFoundService.deleteLostAndFound(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createLostAndFound,
  getLostAndFounds,
  getLostAndFoundById,
  updateLostAndFound,
  deleteLostAndFound,
}
