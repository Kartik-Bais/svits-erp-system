const router   = require('express').Router()
const passport = require('passport')
const jwt      = require('jsonwebtoken')

const authCtrl          = require('../controllers/auth.controller')
const { validate }      = require('../middleware/validate.middleware')
const { authenticate }  = require('../middleware/auth.middleware')
const { authLimiter }   = require('../middleware/rateLimiter.middleware')
const schemas           = require('../validators/auth.validator')

// ── Public — rate-limited ─────────────────────────────────────────────────────
router.post('/register',        authLimiter, validate(schemas.register),       authCtrl.register)
router.post('/verify-email',    authLimiter, validate(schemas.verifyEmail),    authCtrl.verifyEmail)
router.post('/login',           authLimiter, validate(schemas.login),          authCtrl.login)
router.post('/google',          authLimiter, validate(schemas.googleLogin),    authCtrl.googleLogin)
router.post('/forgot-password', authLimiter, validate(schemas.forgotPassword), authCtrl.forgotPassword)
router.post('/reset-password',  authLimiter, validate(schemas.resetPassword),  authCtrl.resetPassword)

// ── Public — token rotation (cookie-based) ────────────────────────────────────
router.post('/refresh', authCtrl.refresh)

// ── Protected ─────────────────────────────────────────────────────────────────
router.post('/logout',          authenticate, authCtrl.logout)
router.post('/change-password', authenticate, validate(schemas.changePassword), authCtrl.changePassword)

// ── Google OAuth ──────────────────────────────────────────────────────────────
// Step 1: Redirect user to Google's consent screen
router.get('/google/redirect', passport.authenticate('google', { scope: ['email', 'profile'] }))

// Step 2: Google redirects back here with a code
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
      // 1. Handle our custom 'email_exists' error from passport.js
      if (err) {
        if (err.message === 'email_exists') {
          return res.redirect(`${process.env.CLIENT_URL}/login?error=email_exists`)
        }
        console.error('Google login callback error:', err)
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
      }
      
      // 2. Handle missing user
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
      }
      
      // 3. Generate Token and Redirect on success
      try {
        const token = jwt.sign(
          {
            id:    user._id,
            email: user.email,
            role:  user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`)
      } catch (error) {
        console.error('Token generation error:', error)
        res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
      }
    })(req, res, next)
  }
)

// ── Get current logged-in user (token-based) ──────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user })
})

module.exports = router
