const Result = require('../models/Result.model')
const User = require('../models/User.model')
const Examination = require('../models/Examination.model')
const Subject = require('../models/Subject.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const validateResultData = async (data) => {
  const [student, exam, subject] = await Promise.all([
    User.findById(data.student),
    Examination.findById(data.examination),
    Subject.findById(data.subject),
  ])

  if (!student || student.role !== ROLES.STUDENT) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid student')
  if (!exam) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid examination')
  if (!subject) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid subject')
  
  if (data.marksObtained > data.maxMarks) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Marks obtained cannot exceed maximum marks')
  }
}

const createResult = async (data, userId) => {
  await validateResultData(data)

  const exists = await Result.findOne({
    student: data.student,
    examination: data.examination,
    subject: data.subject,
  })

  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Result already exists for this student in this subject and examination')
  }

  return Result.create({ ...data, createdBy: userId })
}

const createBulkResult = async (records, userId) => {
  for (const record of records) {
    record.createdBy = userId
    if (record.marksObtained > record.maxMarks) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Marks obtained cannot exceed maximum marks for student ${record.student}`)
    }
  }

  try {
    const result = await Result.insertMany(records, { ordered: false })
    return result
  } catch (err) {
    if (err.code === 11000) {
      return err.insertedDocs || []
    }
    throw err
  }
}

const getResults = async (queryString) => {
  const features = new ApiFeatures(
    Result.find()
      .populate('student', 'name email')
      .populate('examination', 'name type')
      .populate('subject', 'name code type'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Result.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getResultById = async (id) => {
  const result = await Result.findById(id)
    .populate('student', 'name email')
    .populate('examination', 'name type')
    .populate('subject', 'name code type')
  
  if (!result) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return result
}

const updateResult = async (id, data, userId) => {
  const result = await Result.findById(id)
  if (!result) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  const checkMax = data.maxMarks || result.maxMarks
  const checkObt = data.marksObtained !== undefined ? data.marksObtained : result.marksObtained

  if (checkObt > checkMax) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Marks obtained cannot exceed maximum marks')
  }

  Object.assign(result, { ...data, updatedBy: userId })
  await result.save()
  return result
}

const deleteResult = async (id, userId) => {
  const result = await Result.findById(id)
  if (!result) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  result.isActive = false
  result.updatedBy = userId
  await result.save()
  return result
}

module.exports = {
  createResult,
  createBulkResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
}
