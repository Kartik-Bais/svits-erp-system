const router = require('express').Router()
const auditCtrl = require('../controllers/audit.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const { ROLES } = require('../constants/roles')
const activityLogSchema = require('../validators/activityLog.validator')

router.use(authenticate)

router.get(
  '/logs',
  authorize(ROLES.ADMIN),
  validate(activityLogSchema.getActivityLogs, 'query'),
  auditCtrl.getActivityLogs
)

module.exports = router
