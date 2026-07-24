const User        = require('../models/User.model')
const tokenService = require('../services/token.service')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse  = require('../utils/ApiResponse')
const ApiError     = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

// GET /users/me
const getProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROFILE_FETCHED, req.user))
})

// PATCH /users/me
const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar', 'department', 'designation']
  const updates = {}

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  })

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  )

  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROFILE_UPDATED, user))
})

// DELETE /users/me
const deleteAccount = asyncHandler(async (req, res) => {
  // Soft delete — mark inactive and revoke all sessions
  await User.findByIdAndUpdate(req.user._id, { isActive: false })
  await tokenService.revokeAllUserTokens(req.user._id)

  res.clearCookie('refreshToken')
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.ACCOUNT_DELETED))
})

// GET /users/:id  (Admin only)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  res.json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROFILE_FETCHED, user))
})

module.exports = { getProfile, updateProfile, deleteAccount, getUserById }
