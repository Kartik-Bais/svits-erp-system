const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const Token    = require('../models/Token.model')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_EXP     = process.env.JWT_ACCESS_EXPIRES  || '15m'
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES || '7d'

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXP })

/**
 * Creates a refresh token, hashes it, and persists the hash to the database.
 * The raw token is returned to be set as an httpOnly cookie.
 */
const generateRefreshToken = async (user, { ip, userAgent } = {}) => {
  const raw  = crypto.randomBytes(40).toString('hex')
  const hash = crypto.createHash('sha256').update(raw).digest('hex')

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await Token.create({ user: user._id, tokenHash: hash, expiresAt, ip, userAgent })

  return raw
}

/**
 * Validates a refresh token by hashing the incoming value and looking it up.
 * Throws if the token is missing, expired, or not found.
 */
const verifyRefreshToken = async (raw) => {
  if (!raw) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_TOKEN)

  const hash  = crypto.createHash('sha256').update(raw).digest('hex')
  const found = await Token.findOne({ tokenHash: hash }).populate('user')

  if (!found || found.expiresAt < new Date()) {
    if (found) await found.deleteOne()
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_TOKEN)
  }

  return found
}

const revokeRefreshToken = async (raw) => {
  const hash = crypto.createHash('sha256').update(raw).digest('hex')
  await Token.deleteOne({ tokenHash: hash })
}

const revokeAllUserTokens = async (userId) => {
  await Token.deleteMany({ user: userId })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
}
