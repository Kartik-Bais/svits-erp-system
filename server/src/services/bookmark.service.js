const Bookmark = require('../models/Bookmark.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')

const toggleBookmark = async (data, userId) => {
  const existing = await Bookmark.findOne({
    user: userId,
    resourceType: data.resourceType,
    resourceId: data.resourceId,
  })

  if (existing) {
    // Toggle off (delete)
    await Bookmark.findByIdAndDelete(existing._id)
    return { bookmarked: false }
  } else {
    // Toggle on (create)
    await Bookmark.create({ ...data, user: userId })
    return { bookmarked: true }
  }
}

const getBookmarks = async (queryString, userId) => {
  // Only fetch bookmarks for the requesting user
  const query = Bookmark.find({ user: userId })

  const features = new ApiFeatures(query, queryString)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Bookmark.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

module.exports = {
  toggleBookmark,
  getBookmarks,
}
