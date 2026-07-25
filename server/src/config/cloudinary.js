const cloudinary = require('cloudinary').v2
const logger = require('./logger')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key:    process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
})

logger.info('Cloudinary configured')

module.exports = cloudinary
