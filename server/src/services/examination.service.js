const Examination = require('../models/Examination.model')
const Course = require('../models/Course.model')
const Semester = require('../models/Semester.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createExamination = async (data, userId) => {
  const course = await Course.findById(data.course)
  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')

  const semester = await Semester.findById(data.semester)
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Semester not found')

  if (semester.course.toString() !== course._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Semester does not belong to course')
  }

  const exists = await Examination.findOne({
    name: data.name,
    semester: data.semester
  })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Examination with this name already exists for this semester')
  }

  return Examination.create({ ...data, createdBy: userId })
}

const getExaminations = async (queryString) => {
  const features = new ApiFeatures(
    Examination.find()
      .populate('course', 'name code')
      .populate('semester', 'number year'),
    queryString
  )
    .filter()
    .search(['name'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Examination.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getExaminationById = async (id) => {
  const examination = await Examination.findById(id)
    .populate('course', 'name code')
    .populate('semester', 'number year')
  
  if (!examination) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return examination
}

const updateExamination = async (id, data, userId) => {
  const examination = await Examination.findById(id)
  if (!examination) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.course || data.semester) {
    const checkCourse = data.course || examination.course
    const checkSemester = data.semester || examination.semester

    const semester = await Semester.findById(checkSemester)
    if (!semester || semester.course.toString() !== checkCourse.toString()) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid course and semester combination')
    }
  }

  Object.assign(examination, { ...data, updatedBy: userId })
  await examination.save()
  return examination
}

const deleteExamination = async (id, userId) => {
  const examination = await Examination.findById(id)
  if (!examination) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  examination.isActive = false
  examination.updatedBy = userId
  await examination.save()
  return examination
}

module.exports = {
  createExamination,
  getExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination,
}
