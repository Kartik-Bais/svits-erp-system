const GatePass = require('../models/GatePass.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createGatePass = async (data, userId) => {
  // Ensure user doesn't have an overlapping pending/approved gate pass
  const existing = await GatePass.findOne({
    user: userId,
    status: { $in: ['Pending', 'Approved', 'Out'] }
  })
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'You already have an active or pending gate pass')
  }

  data.user = userId // Force user ID to match token
  return GatePass.create(data)
}

const getGatePasses = async (queryString) => {
  const features = new ApiFeatures(
    GatePass.find()
      .populate('user', 'name email role')
      .populate('approvedBy', 'name email'),
    queryString
  )
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    GatePass.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getGatePassById = async (id) => {
  const gatePass = await GatePass.findById(id)
    .populate('user', 'name email role')
    .populate('approvedBy', 'name email')
  
  if (!gatePass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return gatePass
}

const updateGatePass = async (id, data, userId) => {
  const gatePass = await GatePass.findById(id)
  if (!gatePass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (['Approved', 'Rejected'].includes(data.status)) {
    data.approvedBy = userId
  }

  if (data.status === 'Returned' && gatePass.status === 'Out') {
    data.actualInTime = new Date()
  }

  Object.assign(gatePass, data)
  await gatePass.save()
  return gatePass
}

const deleteGatePass = async (id) => {
  const gatePass = await GatePass.findById(id)
  if (!gatePass) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  gatePass.isActive = false
  await gatePass.save()
  return gatePass
}

module.exports = {
  createGatePass,
  getGatePasses,
  getGatePassById,
  updateGatePass,
  deleteGatePass,
}
