const messMenuService = require('../services/messMenu.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createMessMenu = asyncHandler(async (req, res) => {
  const menu = await messMenuService.createMessMenu(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, menu))
})

const getMessMenus = asyncHandler(async (req, res) => {
  const { data, total } = await messMenuService.getMessMenus(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getMessMenuById = asyncHandler(async (req, res) => {
  const menu = await messMenuService.getMessMenuById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, menu))
})

const updateMessMenu = asyncHandler(async (req, res) => {
  const menu = await messMenuService.updateMessMenu(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, menu))
})

const deleteMessMenu = asyncHandler(async (req, res) => {
  await messMenuService.deleteMessMenu(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createMessMenu,
  getMessMenus,
  getMessMenuById,
  updateMessMenu,
  deleteMessMenu,
}
