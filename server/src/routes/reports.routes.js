const router = require('express').Router()
const reportsCtrl = require('../controllers/reports.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router.get(
  '/canteen-orders',
  authorize(ROLES.ADMIN, ROLES.STAFF),
  reportsCtrl.exportCanteenOrdersCSV
)

router.get(
  '/students',
  authorize(ROLES.ADMIN, ROLES.STAFF),
  reportsCtrl.exportStudentsCSV
)

module.exports = router
