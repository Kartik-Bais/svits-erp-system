const bookService = require('../services/book.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, MESSAGES.CREATED, book))
})

const getBooks = asyncHandler(async (req, res) => {
  const { data, total } = await bookService.getBooks(req.query)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, { total, data }))
})

const getBookById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.FETCHED, book))
})

const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.UPDATED, book))
})

const deleteBook = asyncHandler(async (req, res) => {
  await bookService.deleteBook(req.params.id, req.user._id)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, MESSAGES.DELETED))
})

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
}
