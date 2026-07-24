const attendanceService = require('../services/attendance.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createAttendance = asyncHandler(async (req, res) => {
  // If the payload is an array, route to bulk creation
  if (Array.isArray(req.body)) {
    const result = await attendanceService.createBulkAttendance(req.body, req.user._id)
    return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Bulk attendance processed', { inserted: result.length }))
  }

  const attendance = await attendanceService.createAttendance(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, attendance))
})

const getAttendance = asyncHandler(async (req, res) => {
  const { data, total } = await attendanceService.getAttendance(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, attendance))
})

const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.updateAttendance(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, attendance))
})

const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
}
