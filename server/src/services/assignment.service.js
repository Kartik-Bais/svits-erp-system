const Assignment = require('../models/Assignment.model')
const Subject = require('../models/Subject.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const createAssignment = async (data, userId) => {
  const [subject, faculty] = await Promise.all([
    Subject.findById(data.subject),
    User.findById(data.faculty)
  ])

  if (!subject) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Subject not found')
  if (!faculty) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Faculty not found')
  if (faculty.role !== ROLES.FACULTY && faculty.role !== ROLES.HOD) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Faculty reference is invalid')
  }

  // Ensure deadline is in the future
  if (new Date(data.deadline) < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Deadline must be in the future')
  }

  return Assignment.create({ ...data, createdBy: userId })
}

const getAssignments = async (queryString) => {
  const features = new ApiFeatures(
    Assignment.find()
      .populate('subject', 'name code')
      .populate('faculty', 'name email'),
    queryString
  )
    .filter()
    .search(['title', 'description'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Assignment.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getAssignmentById = async (id) => {
  const assignment = await Assignment.findById(id)
    .populate('subject', 'name code')
    .populate('faculty', 'name email')
  
  if (!assignment) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return assignment
}

const updateAssignment = async (id, data, userId) => {
  const assignment = await Assignment.findById(id)
  if (!assignment) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.deadline && new Date(data.deadline) < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Deadline must be in the future')
  }

  Object.assign(assignment, { ...data, updatedBy: userId })
  await assignment.save()
  return assignment
}

const deleteAssignment = async (id, userId) => {
  const assignment = await Assignment.findById(id)
  if (!assignment) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  assignment.isActive = false
  assignment.updatedBy = userId
  await assignment.save()
  return assignment
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
}
