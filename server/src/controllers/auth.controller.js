const authService  = require('../services/auth.service')
const tokenService = require('../services/token.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse  = require('../utils/ApiResponse')
const ApiError     = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

// Cookie settings for the refresh token
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in ms
}

const setRefreshCookie = (res, token) =>
  res.cookie('refreshToken', token, COOKIE_OPTIONS)

const clearRefreshCookie = (res) =>
  res.clearCookie('refreshToken', COOKIE_OPTIONS)

// POST /auth/register
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body)
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.REGISTER_SUCCESS, { id: user._id })
  )
})

// POST /auth/verify-email
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body.token)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.EMAIL_VERIFIED, { id: user._id }))
})

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body)

  const [accessToken, refreshToken] = await Promise.all([
    tokenService.generateAccessToken(user),
    tokenService.generateRefreshToken(user, {
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    }),
  ])

  setRefreshCookie(res, refreshToken)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, { accessToken, user }))
})

// POST /auth/google
const googleLogin = asyncHandler(async (req, res) => {
  const user = await authService.loginWithGoogle(req.body.idToken)

  const [accessToken, refreshToken] = await Promise.all([
    tokenService.generateAccessToken(user),
    tokenService.generateRefreshToken(user, {
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    }),
  ])

  setRefreshCookie(res, refreshToken)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, { accessToken, user }))
})

// POST /auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.refreshToken
  if (!raw) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_TOKEN)

  const found = await tokenService.verifyRefreshToken(raw)
  const user  = found.user

  // Rotate refresh token
  await found.deleteOne()
  const [accessToken, newRefreshToken] = await Promise.all([
    tokenService.generateAccessToken(user),
    tokenService.generateRefreshToken(user, {
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    }),
  ])

  setRefreshCookie(res, newRefreshToken)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TOKEN_REFRESHED, { accessToken }))
})

// POST /auth/logout
const logout = asyncHandler(async (req, res) => {
  const raw = req.cookies?.refreshToken
  if (raw) await tokenService.revokeRefreshToken(raw)
  clearRefreshCookie(res)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGOUT_SUCCESS))
})

// POST /auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email)
  // Always respond 200 to prevent email enumeration
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PASSWORD_RESET_SENT))
})

// POST /auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PASSWORD_RESET_SUCCESS))
})

// POST /auth/change-password  (authenticated)
const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword,
  )
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PASSWORD_CHANGED))
})

module.exports = {
  register,
  verifyEmail,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
}
