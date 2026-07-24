const Book = require('../models/Book.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBook = async (data, userId) => {
  const exists = await Book.findOne({ isbn: data.isbn })
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Book with this ISBN already exists')
  }

  return Book.create({ ...data, createdBy: userId })
}

const getBooks = async (queryString) => {
  const features = new ApiFeatures(Book.find(), queryString)
    .filter()
    .search(['title', 'author', 'isbn', 'category'])
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Book.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getBookById = async (id) => {
  const book = await Book.findById(id)
  if (!book) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return book
}

const updateBook = async (id, data, userId) => {
  const book = await Book.findById(id)
  if (!book) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.isbn) {
    const exists = await Book.findOne({ _id: { $ne: id }, isbn: data.isbn })
    if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, 'Book with this ISBN already exists')
  }

  const checkTotal = data.totalCopies !== undefined ? data.totalCopies : book.totalCopies
  const checkAvailable = data.availableCopies !== undefined ? data.availableCopies : book.availableCopies

  if (checkAvailable > checkTotal) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Available copies cannot exceed total copies')
  }

  Object.assign(book, { ...data, updatedBy: userId })
  await book.save()
  return book
}

const deleteBook = async (id, userId) => {
  const book = await Book.findById(id)
  if (!book) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  book.isActive = false
  book.updatedBy = userId
  await book.save()
  return book
}

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
}
