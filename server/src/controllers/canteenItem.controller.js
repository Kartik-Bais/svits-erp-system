const canteenItemService = require('../services/canteenItem.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createCanteenItem = asyncHandler(async (req, res) => {
  const item = await canteenItemService.createCanteenItem(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, item))
})

const getCanteenItems = asyncHandler(async (req, res) => {
  const { data, total } = await canteenItemService.getCanteenItems(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getCanteenItemById = asyncHandler(async (req, res) => {
  const item = await canteenItemService.getCanteenItemById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, item))
})

const updateCanteenItem = asyncHandler(async (req, res) => {
  const item = await canteenItemService.updateCanteenItem(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, item))
})

const deleteCanteenItem = asyncHandler(async (req, res) => {
  await canteenItemService.deleteCanteenItem(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createCanteenItem,
  getCanteenItems,
  getCanteenItemById,
  updateCanteenItem,
  deleteCanteenItem,
}
