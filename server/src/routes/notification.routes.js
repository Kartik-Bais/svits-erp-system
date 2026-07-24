const router = require('express').Router()
const notificationCtrl = require('../controllers/notification.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const notificationSchema = require('../validators/notification.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

// Users interacting with their own notifications
router.get('/my', notificationCtrl.getMyNotifications)
router.put('/mark-all-read', notificationCtrl.markAllAsRead)
router.put('/:id/read', notificationCtrl.markAsRead)
router.delete('/:id', notificationCtrl.deleteNotification)

// Admins creating system notifications manually
router.post(
  '/',
  authorize(ROLES.ADMIN),
  validate(notificationSchema.createNotification, 'body'),
  notificationCtrl.createNotification
)

module.exports = router
