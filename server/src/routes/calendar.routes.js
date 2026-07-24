const router = require('express').Router()
const calendarCtrl = require('../controllers/calendar.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.use(authenticate)

router.get('/feed', calendarCtrl.getUnifiedCalendar)

module.exports = router
