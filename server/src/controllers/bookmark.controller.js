const bookmarkService = require('../services/bookmark.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const toggleBookmark = asyncHandler(async (req, res) => {
  const result = await bookmarkService.toggleBookmark(req.body, req.user._id)
  const message = result.bookmarked ? 'Bookmark added successfully' : 'Bookmark removed successfully'
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, message, result))
})

const getBookmarks = asyncHandler(async (req, res) => {
  const { data, total } = await bookmarkService.getBookmarks(req.query, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Bookmarks fetched successfully', { total, data }))
})

module.exports = {
  toggleBookmark,
  getBookmarks,
}
