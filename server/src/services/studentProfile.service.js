const StudentProfile = require('../models/StudentProfile.model')
const User = require('../models/User.model')
const Department = require('../models/Department.model')
const Course = require('../models/Course.model')
const Semester = require('../models/Semester.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const createStudentProfile = async (data, userId) => {
  const user = await User.findById(data.user)
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  if (user.role !== ROLES.STUDENT) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User role is not student')

  const exists = await StudentProfile.findOne({ $or: [{ user: data.user }, { enrollmentNo: data.enrollmentNo }] })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Profile for this user or enrollment number already exists')
  }

  const [dept, course, sem] = await Promise.all([
    Department.findById(data.department),
    Course.findById(data.course),
    Semester.findById(data.currentSemester)
  ])

  if (!dept || !course || !sem) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department, Course, or Semester not found')
  }

  return StudentProfile.create({ ...data, createdBy: userId })
}

const getStudentProfiles = async (queryString) => {
  const features = new ApiFeatures(
    StudentProfile.find()
      .populate('user', 'name email avatar phone')
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate('currentSemester', 'number year'),
    queryString
  )
    .filter()
    .search(['enrollmentNo']) // Can expand if needed
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    StudentProfile.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getStudentProfileById = async (id) => {
  const profile = await StudentProfile.findById(id)
    .populate('user', 'name email avatar phone')
    .populate('department', 'name code')
    .populate('course', 'name code')
    .populate('currentSemester', 'number year')

  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return profile
}

const updateStudentProfile = async (id, data, userId) => {
  const profile = await StudentProfile.findById(id)
  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.enrollmentNo) {
    const exists = await StudentProfile.findOne({ _id: { $ne: id }, enrollmentNo: data.enrollmentNo })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Enrollment number already exists')
  }

  Object.assign(profile, { ...data, updatedBy: userId })
  await profile.save()
  return profile
}

const deleteStudentProfile = async (id, userId) => {
  const profile = await StudentProfile.findById(id)
  if (!profile) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  profile.isActive = false
  profile.updatedBy = userId
  await profile.save()
  return profile
}

module.exports = {
  createStudentProfile,
  getStudentProfiles,
  getStudentProfileById,
  updateStudentProfile,
  deleteStudentProfile,
}
