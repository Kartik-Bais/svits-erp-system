const libraryFineService = require('../services/libraryFine.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLibraryFine = asyncHandler(async (req, res) => {
  const fine = await libraryFineService.createLibraryFine(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, fine))
})

const getLibraryFines = asyncHandler(async (req, res) => {
  const { data, total } = await libraryFineService.getLibraryFines(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getLibraryFineById = asyncHandler(async (req, res) => {
  const fine = await libraryFineService.getLibraryFineById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, fine))
})

const updateLibraryFine = asyncHandler(async (req, res) => {
  const fine = await libraryFineService.updateLibraryFine(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, fine))
})

const deleteLibraryFine = asyncHandler(async (req, res) => {
  await libraryFineService.deleteLibraryFine(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createLibraryFine,
  getLibraryFines,
  getLibraryFineById,
  updateLibraryFine,
  deleteLibraryFine,
}
