const BookIssue = require('../models/BookIssue.model')
const Book = require('../models/Book.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const issueBook = async (data, userId) => {
  const [book, user] = await Promise.all([
    Book.findById(data.book),
    User.findById(data.user)
  ])

  if (!book) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Book not found')
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')

  if (book.availableCopies <= 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Book is currently out of stock')
  }

  // Prevent multiple issues of the same book to the same user
  const existingIssue = await BookIssue.findOne({ book: book._id, user: user._id, status: { $in: ['Issued', 'Overdue'] } })
  if (existingIssue) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User already has an active issue for this book')
  }

  // Atomically decrease available copies
  book.availableCopies -= 1
  await book.save()

  return BookIssue.create({ ...data, issuedBy: userId })
}

const returnBook = async (id, data, userId) => {
  const issue = await BookIssue.findById(id).populate('book')
  if (!issue) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (issue.status === 'Returned') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Book is already returned')
  }

  issue.status = 'Returned'
  issue.returnDate = new Date()
  issue.remarks = data.remarks
  issue.updatedBy = userId

  // Increase available copies
  if (issue.book) {
    const book = await Book.findById(issue.book._id)
    if (book) {
      book.availableCopies += 1
      await book.save()
    }
  }

  await issue.save()
  return issue
}

const renewBook = async (id, data, userId) => {
  const issue = await BookIssue.findById(id)
  if (!issue) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (issue.status === 'Returned') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot renew a returned book')
  }

  if (issue.renewals >= 3) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum renewal limit reached')
  }

  issue.dueDate = data.newDueDate
  issue.renewals += 1
  issue.status = 'Issued' // Resets overdue status if applicable
  issue.updatedBy = userId
  await issue.save()

  return issue
}

const getBookIssues = async (queryString) => {
  const features = new ApiFeatures(
    BookIssue.find()
      .populate('book', 'title author isbn')
      .populate('user', 'name email role'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    BookIssue.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getBookIssueById = async (id) => {
  const issue = await BookIssue.findById(id)
    .populate('book', 'title author isbn coverImageUrl')
    .populate('user', 'name email role')
    .populate('issuedBy', 'name email')
  
  if (!issue) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return issue
}

const updateBookIssue = async (id, data, userId) => {
  const issue = await BookIssue.findById(id)
  if (!issue) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  Object.assign(issue, { ...data, updatedBy: userId })
  await issue.save()
  return issue
}

const deleteBookIssue = async (id, userId) => {
  const issue = await BookIssue.findById(id)
  if (!issue) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  issue.isActive = false
  issue.updatedBy = userId
  await issue.save()
  return issue
}

module.exports = {
  issueBook,
  returnBook,
  renewBook,
  getBookIssues,
  getBookIssueById,
  updateBookIssue,
  deleteBookIssue,
}
