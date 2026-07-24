const rateLimit = require('express-rate-limit')

const rateLimitHandler = (_req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
  })
}

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  handler:         rateLimitHandler,
})

// Stricter limiter for auth endpoints to slow brute-force attacks
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  handler:         rateLimitHandler,
})

const assistantLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests to the Campus Assistant. Please try again after 15 minutes.',
    })
  },
})

module.exports = { apiLimiter, authLimiter, assistantLimiter }
