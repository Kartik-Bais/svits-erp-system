const Semester = require('../models/Semester.model')
const Course = require('../models/Course.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createSemester = async (data, userId) => {
  const course = await Course.findById(data.course)
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')

  if (data.number > course.totalSemesters) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Semester number cannot exceed course total semesters (${course.totalSemesters})`)
  }

  const exists = await Semester.findOne({ number: data.number, course: data.course })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, `Semester ${data.number} already exists for this course`)
  }

  return Semester.create({ ...data, createdBy: userId })
}

const getSemesters = async (queryString) => {
  const features = new ApiFeatures(Semester.find().populate('course', 'name code'), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Semester.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getSemesterById = async (id) => {
  const semester = await Semester.findById(id).populate('course', 'name code')
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return semester
}

const updateSemester = async (id, data, userId) => {
  const semester = await Semester.findById(id)
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.course && data.course !== semester.course.toString()) {
    const course = await Course.findById(data.course)
    if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')
  }

  if (data.number || data.course) {
    const checkNumber = data.number || semester.number
    const checkCourse = data.course || semester.course

    const exists = await Semester.findOne({
      $and: [
        { _id: { $ne: id } },
        { number: checkNumber, course: checkCourse },
      ],
    })
    if (exists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `Semester ${checkNumber} already exists for this course`)
    }
  }

  Object.assign(semester, { ...data, updatedBy: userId })
  await semester.save()
  return semester
}

const deleteSemester = async (id, userId) => {
  const semester = await Semester.findById(id)
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  semester.isActive = false
  semester.updatedBy = userId
  await semester.save()
  return semester
}

module.exports = {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
}
