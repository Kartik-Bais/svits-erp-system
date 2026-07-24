const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloudinary } = require('../utils/cloudinary')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on the route or file type
    let folder = 'svits-erp/general'
    if (file.fieldname === 'profileImage') folder = 'svits-erp/profiles'
    if (file.fieldname === 'assignment') folder = 'svits-erp/assignments'
    if (file.fieldname === 'document') folder = 'svits-erp/documents'
    
    // Support images, pdfs, and documents
    let format = file.mimetype.split('/')[1]
    if (format === 'pdf' || file.mimetype.includes('document')) {
      format = undefined // let cloudinary figure it out for non-images
    }

    return {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid file type. Only JPG, PNG, PDF, DOC, DOCX are allowed.'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

module.exports = upload
