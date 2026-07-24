const router = require('express').Router()
const assistantCtrl = require('../controllers/assistant.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { assistantLimiter } = require('../middleware/rateLimiter.middleware')

// Apply authentication to all Assistant endpoints
router.use(authenticate)

// Apply specific rate limiting to prevent Gemini API abuse
router.use(assistantLimiter)

router.post('/chat', assistantCtrl.chat)
router.post('/summarize', assistantCtrl.summarizeDocument)
router.post('/review-resume', assistantCtrl.reviewResume)
router.post('/plan-study', assistantCtrl.planStudy)
router.post('/analyze-performance', assistantCtrl.analyzePerformance)
router.get('/nl-search', assistantCtrl.nlSearch)
router.delete('/chat/history', assistantCtrl.clearHistory)

module.exports = router
