const SavedFilter = require('../models/SavedFilter.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')

const createSavedFilter = async (data, userId) => {
  return SavedFilter.create({ ...data, user: userId })
}

const getSavedFilters = async (queryString, userId) => {
  const query = SavedFilter.find({ user: userId })

  const features = new ApiFeatures(query, queryString)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    SavedFilter.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const deleteSavedFilter = async (id, userId) => {
  const filter = await SavedFilter.findById(id)
  
  if (!filter) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Filter not found')
  }

  if (filter.user.toString() !== userId.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to delete this filter')
  }

  await SavedFilter.findByIdAndDelete(id)
  return true
}

module.exports = {
  createSavedFilter,
  getSavedFilters,
  deleteSavedFilter,
}
