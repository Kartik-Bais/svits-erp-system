const Complaint = require('../models/Complaint.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createComplaint = async (data, userId) => {
  data.user = userId
  return Complaint.create(data)
}

const getComplaints = async (queryString) => {
  const features = new ApiFeatures(
    Complaint.find()
      .populate('user', 'name email role')
      .populate('resolvedBy', 'name email'),
    queryString
  )
    .filter()
    .search(['title', 'description', 'category'])
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Complaint.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getComplaintById = async (id) => {
  const complaint = await Complaint.findById(id)
    .populate('user', 'name email role')
    .populate('resolvedBy', 'name email')
  
  if (!complaint) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return complaint
}

const updateComplaint = async (id, data, userId) => {
  const complaint = await Complaint.findById(id)
  if (!complaint) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (['Resolved', 'Rejected'].includes(data.status)) {
    data.resolvedBy = userId
  }

  Object.assign(complaint, data)
  await complaint.save()
  return complaint
}

const deleteComplaint = async (id) => {
  const complaint = await Complaint.findById(id)
  if (!complaint) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  complaint.isActive = false
  await complaint.save()
  return complaint
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
}
