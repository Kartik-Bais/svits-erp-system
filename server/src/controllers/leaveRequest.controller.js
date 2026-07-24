const leaveRequestService = require('../services/leaveRequest.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLeaveRequest = asyncHandler(async (req, res) => {
  const request = await leaveRequestService.createLeaveRequest(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, request))
})

const getLeaveRequests = asyncHandler(async (req, res) => {
  const { data, total } = await leaveRequestService.getLeaveRequests(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getLeaveRequestById = asyncHandler(async (req, res) => {
  const request = await leaveRequestService.getLeaveRequestById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, request))
})

const updateLeaveRequest = asyncHandler(async (req, res) => {
  const request = await leaveRequestService.updateLeaveRequest(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, request))
})

const deleteLeaveRequest = asyncHandler(async (req, res) => {
  await leaveRequestService.deleteLeaveRequest(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest,
}
