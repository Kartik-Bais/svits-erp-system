const submissionService = require('../services/submission.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.createSubmission(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, submission))
})

const getSubmissions = asyncHandler(async (req, res) => {
  const { data, total } = await submissionService.getSubmissions(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, submission))
})

const updateSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.updateSubmission(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, submission))
})

const deleteSubmission = asyncHandler(async (req, res) => {
  await submissionService.deleteSubmission(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
}
