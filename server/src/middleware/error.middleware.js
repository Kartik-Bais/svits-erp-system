const logger   = require('../config/logger')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')

const notFound = (req, _res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.originalUrl}`))
}

const errorHandler = (err, _req, res, _next) => {
  // Log all errors; only stack traces in non-production
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack)
  } else {
    logger.error(err.message)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken.`,
    })
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: errors[0],
      errors,
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token.',
    })
  }

  // Our own ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success:  false,
      message:  err.message,
      errors:   err.errors,
    })
  }

  // Unhandled — never expose internals
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  })
}

module.exports = { notFound, errorHandler }
