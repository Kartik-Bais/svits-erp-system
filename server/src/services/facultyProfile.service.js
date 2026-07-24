const FacultyProfile = require('../models/FacultyProfile.model')
const User = require('../models/User.model')
const Department = require('../models/Department.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const createFacultyProfile = async (data, userId) => {
  const user = await User.findById(data.user)
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  if (user.role !== ROLES.FACULTY && user.role !== ROLES.HOD && user.role !== ROLES.ADMIN) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User role is not appropriate for faculty profile')
  }

  const exists = await FacultyProfile.findOne({ $or: [{ user: data.user }, { employeeId: data.employeeId }] })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Profile for this user or employee ID already exists')
  }

  const dept = await Department.findById(data.department)
  if (!dept) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')

  return FacultyProfile.create({ ...data, createdBy: userId })
}

const getFacultyProfiles = async (queryString) => {
  const features = new ApiFeatures(
    FacultyProfile.find()
      .populate('user', 'name email avatar phone role')
      .populate('department', 'name code'),
    queryString
  )
    .filter()
    .search(['employeeId', 'designation'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    FacultyProfile.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getFacultyProfileById = async (id) => {
  const profile = await FacultyProfile.findById(id)
    .populate('user', 'name email avatar phone role')
    .populate('department', 'name code')

  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return profile
}

const updateFacultyProfile = async (id, data, userId) => {
  const profile = await FacultyProfile.findById(id)
  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.employeeId) {
    const exists = await FacultyProfile.findOne({ _id: { $ne: id }, employeeId: data.employeeId })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Employee ID already exists')
  }

  if (data.department && data.department !== profile.department.toString()) {
    const dept = await Department.findById(data.department)
    if (!dept) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')
  }

  Object.assign(profile, { ...data, updatedBy: userId })
  await profile.save()
  return profile
}

const deleteFacultyProfile = async (id, userId) => {
  const profile = await FacultyProfile.findById(id)
  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  profile.isActive = false
  profile.updatedBy = userId
  await profile.save()
  return profile
}

module.exports = {
  createFacultyProfile,
  getFacultyProfiles,
  getFacultyProfileById,
  updateFacultyProfile,
  deleteFacultyProfile,
}
