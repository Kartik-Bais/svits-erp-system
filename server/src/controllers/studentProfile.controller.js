const studentProfileService = require('../services/studentProfile.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createStudentProfile = asyncHandler(async (req, res) => {
  const profile = await studentProfileService.createStudentProfile(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, profile))
})

const getStudentProfiles = asyncHandler(async (req, res) => {
  const { data, total } = await studentProfileService.getStudentProfiles(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getStudentProfileById = asyncHandler(async (req, res) => {
  const profile = await studentProfileService.getStudentProfileById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, profile))
})

const updateStudentProfile = asyncHandler(async (req, res) => {
  const profile = await studentProfileService.updateStudentProfile(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, profile))
})

const deleteStudentProfile = asyncHandler(async (req, res) => {
  await studentProfileService.deleteStudentProfile(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createStudentProfile,
  getStudentProfiles,
  getStudentProfileById,
  updateStudentProfile,
  deleteStudentProfile,
}
