const documentService = require('../services/document.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(false, 'No file uploaded'))
  }

  const document = await documentService.createDocument(req.body, req.file.path, req.user._id)
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(true, 'Document uploaded successfully', document))
})

const getDocuments = asyncHandler(async (req, res) => {
  const { data, total } = await documentService.getDocuments(req.query, req.user._id, req.user.role)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Documents fetched successfully', { total, data }))
})

const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.user._id, req.user.role)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Document deleted successfully'))
})

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
}
