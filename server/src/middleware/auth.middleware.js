const jwt      = require('jsonwebtoken')
const User     = require('../models/User.model')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    const user    = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED))
    }

    req.user = user
    next()
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Access token expired.'
      : MESSAGES.INVALID_TOKEN

    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, message))
  }
}

module.exports = { authenticate }
