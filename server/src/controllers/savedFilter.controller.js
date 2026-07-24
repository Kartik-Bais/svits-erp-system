const savedFilterService = require('../services/savedFilter.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const createSavedFilter = asyncHandler(async (req, res) => {
  const filter = await savedFilterService.createSavedFilter(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Filter saved successfully', filter))
})

const getSavedFilters = asyncHandler(async (req, res) => {
  const { data, total } = await savedFilterService.getSavedFilters(req.query, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Saved filters fetched successfully', { total, data }))
})

const deleteSavedFilter = asyncHandler(async (req, res) => {
  await savedFilterService.deleteSavedFilter(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Filter deleted successfully'))
})

module.exports = {
  createSavedFilter,
  getSavedFilters,
  deleteSavedFilter,
}
