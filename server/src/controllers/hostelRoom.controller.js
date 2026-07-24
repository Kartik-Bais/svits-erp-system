const hostelRoomService = require('../services/hostelRoom.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createHostelRoom = asyncHandler(async (req, res) => {
  const room = await hostelRoomService.createHostelRoom(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, room))
})

const getHostelRooms = asyncHandler(async (req, res) => {
  const { data, total } = await hostelRoomService.getHostelRooms(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getHostelRoomById = asyncHandler(async (req, res) => {
  const room = await hostelRoomService.getHostelRoomById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, room))
})

const updateHostelRoom = asyncHandler(async (req, res) => {
  const room = await hostelRoomService.updateHostelRoom(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, room))
})

const deleteHostelRoom = asyncHandler(async (req, res) => {
  await hostelRoomService.deleteHostelRoom(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createHostelRoom,
  getHostelRooms,
  getHostelRoomById,
  updateHostelRoom,
  deleteHostelRoom,
}
