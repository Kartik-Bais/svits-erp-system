const Subject = require('../models/Subject.model')
const Course = require('../models/Course.model')
const Semester = require('../models/Semester.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createSubject = async (data, userId) => {
  const course = await Course.findById(data.course)
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')

  const semester = await Semester.findById(data.semester)
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Semester not found')

  if (semester.course.toString() !== course._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Semester does not belong to the specified course')
  }

  const exists = await Subject.findOne({ code: data.code })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, `Subject with code ${data.code} already exists`)
  }

  return Subject.create({ ...data, createdBy: userId })
}

const getSubjects = async (queryString) => {
  const features = new ApiFeatures(
    Subject.find().populate('course', 'name code').populate('semester', 'number year'),
    queryString
  )
    .filter()
    .search(['name', 'code'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Subject.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getSubjectById = async (id) => {
  const subject = await Subject.findById(id).populate('course', 'name code').populate('semester', 'number year')
  if (!subject) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return subject
}

const updateSubject = async (id, data, userId) => {
  const subject = await Subject.findById(id)
  if (!subject) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.course || data.semester) {
    const checkCourse = data.course || subject.course
    const checkSemester = data.semester || subject.semester

    const course = await Course.findById(checkCourse)
    if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')

    const semester = await Semester.findById(checkSemester)
    if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Semester not found')

    if (semester.course.toString() !== course._id.toString()) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Semester does not belong to the specified course')
    }
  }

  if (data.code) {
    const exists = await Subject.findOne({ _id: { $ne: id }, code: data.code })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, `Subject with code ${data.code} already exists`)
  }

  Object.assign(subject, { ...data, updatedBy: userId })
  await subject.save()
  return subject
}

const deleteSubject = async (id, userId) => {
  const subject = await Subject.findById(id)
  if (!subject) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  subject.isActive = false
  subject.updatedBy = userId
  await subject.save()
  return subject
}

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
}
