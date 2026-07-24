const hostelAllocationService = require('../services/hostelAllocation.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createHostelAllocation = asyncHandler(async (req, res) => {
  const allocation = await hostelAllocationService.createHostelAllocation(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, allocation))
})

const getHostelAllocations = asyncHandler(async (req, res) => {
  const { data, total } = await hostelAllocationService.getHostelAllocations(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getHostelAllocationById = asyncHandler(async (req, res) => {
  const allocation = await hostelAllocationService.getHostelAllocationById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, allocation))
})

const updateHostelAllocation = asyncHandler(async (req, res) => {
  const allocation = await hostelAllocationService.updateHostelAllocation(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, allocation))
})

const deleteHostelAllocation = asyncHandler(async (req, res) => {
  await hostelAllocationService.deleteHostelAllocation(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createHostelAllocation,
  getHostelAllocations,
  getHostelAllocationById,
  updateHostelAllocation,
  deleteHostelAllocation,
}
