const Submission = require('../models/Submission.model')
const Assignment = require('../models/Assignment.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const createSubmission = async (data, userId) => {
  const [assignment, student] = await Promise.all([
    Assignment.findById(data.assignment),
    User.findById(data.student)
  ])

  if (!assignment) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Assignment not found')
  if (!student) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Student not found')
  if (student.role !== ROLES.STUDENT) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User is not a student')
  }

  const exists = await Submission.findOne({ assignment: data.assignment, student: data.student })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'You have already submitted this assignment')
  }

  // Determine if late
  if (new Date() > new Date(assignment.deadline)) {
    data.status = 'Late'
  }

  return Submission.create({ ...data, createdBy: userId })
}

const getSubmissions = async (queryString) => {
  const features = new ApiFeatures(
    Submission.find()
      .populate('assignment', 'title deadline maxMarks')
      .populate('student', 'name email'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Submission.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id)
    .populate('assignment', 'title deadline maxMarks')
    .populate('student', 'name email')
  
  if (!submission) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return submission
}

const updateSubmission = async (id, data, userId) => {
  const submission = await Submission.findById(id).populate('assignment', 'maxMarks')
  if (!submission) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.marksObtained !== undefined) {
    if (data.marksObtained > submission.assignment.maxMarks) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Marks cannot exceed maximum marks (${submission.assignment.maxMarks})`)
    }
    data.status = 'Graded'
  }

  Object.assign(submission, { ...data, updatedBy: userId })
  await submission.save()
  return submission
}

const deleteSubmission = async (id, userId) => {
  const submission = await Submission.findById(id)
  if (!submission) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  submission.isActive = false
  submission.updatedBy = userId
  await submission.save()
  return submission
}

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
}
