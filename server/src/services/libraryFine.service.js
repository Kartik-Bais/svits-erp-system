const LibraryFine = require('../models/LibraryFine.model')
const BookIssue = require('../models/BookIssue.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')

const createLibraryFine = async (data, userId) => {
  const [user, bookIssue] = await Promise.all([
    User.findById(data.user),
    BookIssue.findById(data.bookIssue)
  ])

  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  if (!bookIssue) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'BookIssue not found')

  // Check if fine already exists for this issue
  const existingFine = await LibraryFine.findOne({ bookIssue: bookIssue._id, isActive: true })
  if (existingFine) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A fine record already exists for this book issue')
  }

  return LibraryFine.create({ ...data, createdBy: userId })
}

const getLibraryFines = async (queryString) => {
  const features = new ApiFeatures(
    LibraryFine.find()
      .populate('user', 'name email role')
      .populate({
        path: 'bookIssue',
        select: 'dueDate returnDate',
        populate: { path: 'book', select: 'title isbn' }
      }),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    LibraryFine.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getLibraryFineById = async (id) => {
  const fine = await LibraryFine.findById(id)
    .populate('user', 'name email role')
    .populate({
      path: 'bookIssue',
      select: 'dueDate returnDate',
      populate: { path: 'book', select: 'title isbn' }
    })
  
  if (!fine) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return fine
}

const updateLibraryFine = async (id, data, userId) => {
  const fine = await LibraryFine.findById(id)
  if (!fine) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (data.paymentStatus && ['Paid', 'Waived'].includes(data.paymentStatus) && fine.paymentStatus === 'Pending') {
    data.paymentDate = new Date()
  }

  Object.assign(fine, { ...data, updatedBy: userId })
  await fine.save()
  return fine
}

const deleteLibraryFine = async (id, userId) => {
  const fine = await LibraryFine.findById(id)
  if (!fine) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  fine.isActive = false
  fine.updatedBy = userId
  await fine.save()
  return fine
}

module.exports = {
  createLibraryFine,
  getLibraryFines,
  getLibraryFineById,
  updateLibraryFine,
  deleteLibraryFine,
}
