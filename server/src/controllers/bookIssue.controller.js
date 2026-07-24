const bookIssueService = require('../services/bookIssue.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const issueBook = asyncHandler(async (req, res) => {
  const issue = await bookIssueService.issueBook(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Book issued successfully', issue))
})

const returnBook = asyncHandler(async (req, res) => {
  const issue = await bookIssueService.returnBook(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Book returned successfully', issue))
})

const renewBook = asyncHandler(async (req, res) => {
  const issue = await bookIssueService.renewBook(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Book renewed successfully', issue))
})

const getBookIssues = asyncHandler(async (req, res) => {
  const { data, total } = await bookIssueService.getBookIssues(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getBookIssueById = asyncHandler(async (req, res) => {
  const issue = await bookIssueService.getBookIssueById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, issue))
})

const updateBookIssue = asyncHandler(async (req, res) => {
  const issue = await bookIssueService.updateBookIssue(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, issue))
})

const deleteBookIssue = asyncHandler(async (req, res) => {
  await bookIssueService.deleteBookIssue(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  issueBook,
  returnBook,
  renewBook,
  getBookIssues,
  getBookIssueById,
  updateBookIssue,
  deleteBookIssue,
}
