const Course = require('../models/Course.model')
const Department = require('../models/Department.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createCourse = async (data, userId) => {
  const department = await Department.findById(data.department)
  if (!department) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')

  const exists = await Course.findOne({ $or: [{ name: data.name }, { code: data.code }] })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Course with this name or code already exists')
  }

  return Course.create({ ...data, createdBy: userId })
}

const getCourses = async (queryString) => {
  const features = new ApiFeatures(Course.find().populate('department', 'name code'), queryString)
    .filter()
    .search(['name', 'code'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Course.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getCourseById = async (id) => {
  const course = await Course.findById(id).populate('department', 'name code')
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return course
}

const updateCourse = async (id, data, userId) => {
  const course = await Course.findById(id)
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.department) {
    const department = await Department.findById(data.department)
    if (!department) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')
  }

  if (data.name || data.code) {
    const exists = await Course.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ name: data.name }, { code: data.code }] },
      ],
    })
    if (exists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Course with this name or code already exists')
    }
  }

  Object.assign(course, { ...data, updatedBy: userId })
  await course.save()
  return course
}

const deleteCourse = async (id, userId) => {
  const course = await Course.findById(id)
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  course.isActive = false
  course.updatedBy = userId
  await course.save()
  return course
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
}
