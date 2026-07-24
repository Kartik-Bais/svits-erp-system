const Department = require('../models/Department.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createDepartment = async (data, userId) => {
  const exists = await Department.findOne({ $or: [{ name: data.name }, { code: data.code }] })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Department with this name or code already exists')
  }
  return Department.create({ ...data, createdBy: userId })
}

const getDepartments = async (queryString) => {
  const features = new ApiFeatures(Department.find().populate('hod', 'name email'), queryString)
    .filter()
    .search(['name', 'code'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Department.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getDepartmentById = async (id) => {
  const department = await Department.findById(id).populate('hod', 'name email')
  if (!department) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return department
}

const updateDepartment = async (id, data, userId) => {
  const department = await Department.findById(id)
  if (!department) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.name || data.code) {
    const exists = await Department.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ name: data.name }, { code: data.code }] },
      ],
    })
    if (exists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Department with this name or code already exists')
    }
  }

  Object.assign(department, { ...data, updatedBy: userId })
  await department.save()
  return department
}

const deleteDepartment = async (id, userId) => {
  const department = await Department.findById(id)
  if (!department) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  department.isActive = false
  department.updatedBy = userId
  await department.save()
  return department
}

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
}
