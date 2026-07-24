const Notice = require('../models/Notice.model')
const Department = require('../models/Department.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createNotice = async (data, userId) => {
  if (data.department) {
    const dept = await Department.findById(data.department)
    if (!dept) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')
  }

  return Notice.create({ ...data, createdBy: userId })
}

const getNotices = async (queryString) => {
  // By default, filter out expired notices unless specified
  const baseQuery = Notice.find({
    expiresAt: { $gte: new Date() }
  }).populate('department', 'name code')

  const features = new ApiFeatures(baseQuery, queryString)
    .filter()
    .search(['title', 'content'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Notice.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getNoticeById = async (id) => {
  const notice = await Notice.findById(id).populate('department', 'name code')
  if (!notice) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return notice
}

const updateNotice = async (id, data, userId) => {
  const notice = await Notice.findById(id)
  if (!notice) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.department) {
    const dept = await Department.findById(data.department)
    if (!dept) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Department not found')
  }

  Object.assign(notice, { ...data, updatedBy: userId })
  await notice.save()
  return notice
}

const deleteNotice = async (id, userId) => {
  const notice = await Notice.findById(id)
  if (!notice) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  notice.isActive = false
  notice.updatedBy = userId
  await notice.save()
  return notice
}

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
}
