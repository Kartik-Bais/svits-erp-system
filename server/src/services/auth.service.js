const { OAuth2Client } = require('google-auth-library')
const User    = require('../models/User.model')
const ApiError = require('../utils/ApiError')
const { generateSecureToken, hashToken } = require('../utils/crypto.util')
const { sendVerificationEmail, sendPasswordResetEmail } = require('./email.service')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')
const { ROLES }       = require('../constants/roles')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ── Registration ──────────────────────────────────────────────

const register = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_ALREADY_EXISTS)

  const { raw, hashed } = generateSecureToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 h

  const user = await User.create({
    name,
    email,
    password,
    role: role || ROLES.STUDENT,
    emailVerificationTokenHash: hashed,
    emailVerificationExpiresAt: expiresAt,
  })

  await sendVerificationEmail(email, raw)
  return user
}

// ── Email Verification ─────────────────────────────────────────

const verifyEmail = async (rawToken) => {
  const hashed = hashToken(rawToken)
  const user   = await User.findOne({
    emailVerificationTokenHash: hashed,
    emailVerificationExpiresAt: { $gt: new Date() },
  })

  if (!user) throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_TOKEN)

  user.isEmailVerified              = true
  user.emailVerificationTokenHash   = undefined
  user.emailVerificationExpiresAt   = undefined
  await user.save()

  return user
}

// ── Login ──────────────────────────────────────────────────────

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)
  }
  if (!user.isEmailVerified) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.EMAIL_NOT_VERIFIED)
  }
  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ACCOUNT_INACTIVE)
  }

  user.lastLoginAt = new Date()
  await user.save({ validateBeforeSave: false })

  return user
}

// ── Google OAuth ───────────────────────────────────────────────

const loginWithGoogle = async (idToken) => {
  let payload
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.GOOGLE_AUTH_FAILED)
  }

  const { sub: googleId, email, name, picture } = payload

  let user = await User.findOne({ email })

  if (user) {
    // Link Google account if not already linked
    if (!user.googleId) {
      user.googleId        = googleId
      user.isEmailVerified = true
      if (!user.avatar) user.avatar = picture
      await user.save({ validateBeforeSave: false })
    }
  } else {
    user = await User.create({
      name,
      email,
      googleId,
      avatar:          picture,
      isEmailVerified: true,
      role:            ROLES.STUDENT,
    })
  }

  if (!user.isActive) throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ACCOUNT_INACTIVE)

  user.lastLoginAt = new Date()
  await user.save({ validateBeforeSave: false })

  return user
}

// ── Forgot Password ────────────────────────────────────────────

const forgotPassword = async (email) => {
  const user = await User.findOne({ email })
  // Do not reveal whether the email exists — always return 200
  if (!user) return

  const { raw, hashed } = generateSecureToken()
  const minutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES) || 15

  user.passwordResetTokenHash = hashed
  user.passwordResetExpiresAt = new Date(Date.now() + minutes * 60 * 1000)
  await user.save({ validateBeforeSave: false })

  await sendPasswordResetEmail(email, raw)
}

// ── Reset Password ─────────────────────────────────────────────

const resetPassword = async (rawToken, newPassword) => {
  const hashed = hashToken(rawToken)
  const user   = await User.findOne({
    passwordResetTokenHash: hashed,
    passwordResetExpiresAt: { $gt: new Date() },
  })

  if (!user) throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_TOKEN)

  user.password               = newPassword
  user.passwordResetTokenHash = undefined
  user.passwordResetExpiresAt = undefined
  await user.save()

  return user
}

// ── Change Password (authenticated) ───────────────────────────

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password')
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)

  user.password = newPassword
  await user.save()
}

module.exports = {
  register,
  verifyEmail,
  login,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  changePassword,
}
