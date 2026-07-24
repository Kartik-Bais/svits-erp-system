const Joi = require('joi')
const { ALL_ROLES } = require('../constants/roles')

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .message('Password must be at least 8 characters and contain uppercase, lowercase, and a number')

const register = Joi.object({
  name:     Joi.string().min(2).max(100).required(),
  email:    Joi.string().email().lowercase().required(),
  password: password.required(),
  role:     Joi.string().valid(...ALL_ROLES).default('student'),
})

const login = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
})

const googleLogin = Joi.object({
  idToken: Joi.string().required(),
})

const forgotPassword = Joi.object({
  email: Joi.string().email().lowercase().required(),
})

const resetPassword = Joi.object({
  token:    Joi.string().required(),
  password: password.required(),
})

const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     password.required(),
})

const verifyEmail = Joi.object({
  token: Joi.string().required(),
})

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
}
