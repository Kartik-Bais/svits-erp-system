const LeaveRequest = require('../models/LeaveRequest.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLeaveRequest = async (data, userId) => {
  const existing = await LeaveRequest.findOne({
    user: userId,
    status: 'Pending'
  })

  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'You already have a pending leave request')
  }

  data.user = userId
  return LeaveRequest.create(data)
}

const getLeaveRequests = async (queryString) => {
  const features = new ApiFeatures(
    LeaveRequest.find()
      .populate('user', 'name email role')
      .populate('approvedBy', 'name email'),
    queryString
  )
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    LeaveRequest.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getLeaveRequestById = async (id) => {
  const request = await LeaveRequest.findById(id)
    .populate('user', 'name email role')
    .populate('approvedBy', 'name email')
  
  if (!request) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return request
}

const updateLeaveRequest = async (id, data, userId) => {
  const request = await LeaveRequest.findById(id)
  if (!request) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (['Approved', 'Rejected'].includes(data.status)) {
    data.approvedBy = userId
  }

  Object.assign(request, data)
  await request.save()
  return request
}

const deleteLeaveRequest = async (id) => {
  const request = await LeaveRequest.findById(id)
  if (!request) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  request.isActive = false
  await request.save()
  return request
}

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest,
}
