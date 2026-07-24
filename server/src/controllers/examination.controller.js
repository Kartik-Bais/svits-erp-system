const examinationService = require('../services/examination.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createExamination = asyncHandler(async (req, res) => {
  const examination = await examinationService.createExamination(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, examination))
})

const getExaminations = asyncHandler(async (req, res) => {
  const { data, total } = await examinationService.getExaminations(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getExaminationById = asyncHandler(async (req, res) => {
  const examination = await examinationService.getExaminationById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, examination))
})

const updateExamination = asyncHandler(async (req, res) => {
  const examination = await examinationService.updateExamination(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, examination))
})

const deleteExamination = asyncHandler(async (req, res) => {
  await examinationService.deleteExamination(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createExamination,
  getExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination,
}
