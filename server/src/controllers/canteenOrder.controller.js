const canteenOrderService = require('../services/canteenOrder.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createCanteenOrder = asyncHandler(async (req, res) => {
  const order = await canteenOrderService.createCanteenOrder(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Order placed successfully', order))
})

const getCanteenOrders = asyncHandler(async (req, res) => {
  const { data, total } = await canteenOrderService.getCanteenOrders(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getCanteenOrderById = asyncHandler(async (req, res) => {
  const order = await canteenOrderService.getCanteenOrderById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, order))
})

const updateCanteenOrder = asyncHandler(async (req, res) => {
  const order = await canteenOrderService.updateCanteenOrder(req.params.id, req.body)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, order))
})

const deleteCanteenOrder = asyncHandler(async (req, res) => {
  await canteenOrderService.deleteCanteenOrder(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createCanteenOrder,
  getCanteenOrders,
  getCanteenOrderById,
  updateCanteenOrder,
  deleteCanteenOrder,
}
