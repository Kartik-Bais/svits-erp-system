const HostelAllocation = require('../models/HostelAllocation.model')
const HostelRoom = require('../models/HostelRoom.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createHostelAllocation = async (data, userId) => {
  const [user, room] = await Promise.all([
    User.findById(data.user),
    HostelRoom.findById(data.room)
  ])

  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  if (!room) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Room not found')

  // Check if user already has an active allocation
  const existingAllocation = await HostelAllocation.findOne({ user: user._id, status: 'Allocated' })
  if (existingAllocation) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User already has an active room allocation')
  }

  if (room.currentOccupancy >= room.capacity) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Room is already at full capacity')
  }

  room.currentOccupancy += 1
  await room.save()

  return HostelAllocation.create({ ...data, createdBy: userId })
}

const getHostelAllocations = async (queryString) => {
  const features = new ApiFeatures(
    HostelAllocation.find()
      .populate('user', 'name email role')
      .populate('room', 'roomNo block type'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    HostelAllocation.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getHostelAllocationById = async (id) => {
  const allocation = await HostelAllocation.findById(id)
    .populate('user', 'name email role')
    .populate('room', 'roomNo block type feePerSemester')
  
  if (!allocation) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return allocation
}

const updateHostelAllocation = async (id, data, userId) => {
  const allocation = await HostelAllocation.findById(id).populate('room')
  if (!allocation) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.status === 'Vacated' && allocation.status === 'Allocated') {
    const room = await HostelRoom.findById(allocation.room._id)
    if (room && room.currentOccupancy > 0) {
      room.currentOccupancy -= 1
      await room.save()
    }
    data.leftDate = data.leftDate || new Date()
  }

  Object.assign(allocation, { ...data, updatedBy: userId })
  await allocation.save()
  return allocation
}

const deleteHostelAllocation = async (id, userId) => {
  const allocation = await HostelAllocation.findById(id)
  if (!allocation) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (allocation.status === 'Allocated') {
    const room = await HostelRoom.findById(allocation.room)
    if (room && room.currentOccupancy > 0) {
      room.currentOccupancy -= 1
      await room.save()
    }
  }

  allocation.isActive = false
  allocation.updatedBy = userId
  await allocation.save()
  return allocation
}

module.exports = {
  createHostelAllocation,
  getHostelAllocations,
  getHostelAllocationById,
  updateHostelAllocation,
  deleteHostelAllocation,
}
