const Document = require('../models/Document.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { deleteFromCloudinary, extractPublicId } = require('../utils/cloudinary')

const createDocument = async (data, fileUrl, userId) => {
  const publicId = extractPublicId(fileUrl)
  
  return Document.create({
    ...data,
    fileUrl,
    publicId,
    uploader: userId,
  })
}

const getDocuments = async (queryString, userId, role) => {
  // If not admin/staff, only see own documents, unless it's a global query (needs specific logic if needed)
  let query = Document.find()
  
  if (['STUDENT', 'FACULTY'].includes(role)) {
    query = query.find({ uploader: userId })
  }

  const features = new ApiFeatures(query.populate('uploader', 'name email role'), queryString)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Document.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const deleteDocument = async (id, userId, role) => {
  const document = await Document.findById(id)
  if (!document) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  if (document.uploader.toString() !== userId.toString() && !['ADMIN', 'STAFF'].includes(role)) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.FORBIDDEN)
  }

  // Delete from Cloudinary
  if (document.publicId) {
    await deleteFromCloudinary(document.publicId)
  }

  // Hard delete instead of soft delete to save DB space for documents
  await Document.findByIdAndDelete(id)
  return true
}

module.exports = {
  createDocument,
  getDocuments,
  deleteDocument,
}
