const router       = require('express').Router()
const authCtrl     = require('../controllers/auth.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authLimiter }  = require('../middleware/rateLimiter.middleware')
const schemas          = require('../validators/auth.validator')

// Public — rate-limited
router.post('/register',         authLimiter, validate(schemas.register),        authCtrl.register)
router.post('/verify-email',     authLimiter, validate(schemas.verifyEmail),      authCtrl.verifyEmail)
router.post('/login',            authLimiter, validate(schemas.login),            authCtrl.login)
router.post('/google',           authLimiter, validate(schemas.googleLogin),      authCtrl.googleLogin)
router.post('/forgot-password',  authLimiter, validate(schemas.forgotPassword),   authCtrl.forgotPassword)
router.post('/reset-password',   authLimiter, validate(schemas.resetPassword),    authCtrl.resetPassword)

// Public — token rotation (cookie-based)
router.post('/refresh', authCtrl.refresh)

// Protected
router.post('/logout',          authenticate, authCtrl.logout)
router.post('/change-password', authenticate, validate(schemas.changePassword), authCtrl.changePassword)

module.exports = router
