const semesterService = require('../services/semester.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createSemester = asyncHandler(async (req, res) => {
  const semester = await semesterService.createSemester(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, semester))
})

const getSemesters = asyncHandler(async (req, res) => {
  const { data, total } = await semesterService.getSemesters(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getSemesterById = asyncHandler(async (req, res) => {
  const semester = await semesterService.getSemesterById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, semester))
})

const updateSemester = asyncHandler(async (req, res) => {
  const semester = await semesterService.updateSemester(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, semester))
})

const deleteSemester = asyncHandler(async (req, res) => {
  await semesterService.deleteSemester(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
}
