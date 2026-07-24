const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

/**
 * Role-based access control guard.
 * Usage: authorize(ROLES.ADMIN, ROLES.HOD)
 */
const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED))
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.FORBIDDEN))
  }

  next()
}

module.exports = { authorize }
