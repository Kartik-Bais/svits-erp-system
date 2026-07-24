const departmentService = require('../services/department.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, department))
})

const getDepartments = asyncHandler(async (req, res) => {
  const { data, total } = await departmentService.getDepartments(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, department))
})

const updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, department))
})

const deleteDepartment = asyncHandler(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
}
