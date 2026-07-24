const HostelRoom = require('../models/HostelRoom.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createHostelRoom = async (data, userId) => {
  const exists = await HostelRoom.findOne({ roomNo: data.roomNo, block: data.block })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Room already exists in this block')
  }

  return HostelRoom.create({ ...data, createdBy: userId })
}

const getHostelRooms = async (queryString) => {
  const features = new ApiFeatures(HostelRoom.find(), queryString)
    .filter()
    .search(['roomNo', 'block'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    HostelRoom.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getHostelRoomById = async (id) => {
  const room = await HostelRoom.findById(id)
  if (!room) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return room
}

const updateHostelRoom = async (id, data, userId) => {
  const room = await HostelRoom.findById(id)
  if (!room) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.roomNo || data.block) {
    const checkRoom = data.roomNo || room.roomNo
    const checkBlock = data.block || room.block
    const exists = await HostelRoom.findOne({ _id: { $ne: id }, roomNo: checkRoom, block: checkBlock })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Room already exists in this block')
  }

  const checkCap = data.capacity !== undefined ? data.capacity : room.capacity
  if (room.currentOccupancy > checkCap) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot decrease capacity below current occupancy')
  }

  Object.assign(room, { ...data, updatedBy: userId })
  await room.save()
  return room
}

const deleteHostelRoom = async (id, userId) => {
  const room = await HostelRoom.findById(id)
  if (!room) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (room.currentOccupancy > 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete room with active occupants')
  }

  room.isActive = false
  room.updatedBy = userId
  await room.save()
  return room
}

module.exports = {
  createHostelRoom,
  getHostelRooms,
  getHostelRoomById,
  updateHostelRoom,
  deleteHostelRoom,
}
