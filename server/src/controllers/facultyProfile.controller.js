const facultyProfileService = require('../services/facultyProfile.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createFacultyProfile = asyncHandler(async (req, res) => {
  const profile = await facultyProfileService.createFacultyProfile(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, profile))
})

const getFacultyProfiles = asyncHandler(async (req, res) => {
  const { data, total } = await facultyProfileService.getFacultyProfiles(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getFacultyProfileById = asyncHandler(async (req, res) => {
  const profile = await facultyProfileService.getFacultyProfileById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, profile))
})

const updateFacultyProfile = asyncHandler(async (req, res) => {
  const profile = await facultyProfileService.updateFacultyProfile(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, profile))
})

const deleteFacultyProfile = asyncHandler(async (req, res) => {
  await facultyProfileService.deleteFacultyProfile(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createFacultyProfile,
  getFacultyProfiles,
  getFacultyProfileById,
  updateFacultyProfile,
  deleteFacultyProfile,
}
