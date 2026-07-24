const cloudinary = require('cloudinary').v2
const { ApiError } = require('./ApiError')
const { HTTP_STATUS } = require('../constants/status')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to delete file from Cloudinary')
  }
}

const extractPublicId = (url) => {
  if (!url) return null
  const splitUrl = url.split('/')
  const fileName = splitUrl[splitUrl.length - 1]
  const [publicId] = fileName.split('.')
  // If stored in a folder, include folder path as well, but this simple version works for root or simple setups
  // If using folders, it's better to store public_id alongside the url in the DB.
  return publicId
}

module.exports = {
  cloudinary,
  deleteFromCloudinary,
  extractPublicId,
}
