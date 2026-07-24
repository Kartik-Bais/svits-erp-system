const router = require('express').Router()
const dashboardCtrl = require('../controllers/dashboard.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const { ROLES } = require('../constants/roles')

const { cacheMiddleware } = require('../utils/cache.util')

router.use(authenticate)

router.get(
  '/admin-stats',
  authorize(ROLES.ADMIN, ROLES.STAFF),
  cacheMiddleware(120), // Cache for 2 minutes
  dashboardCtrl.getAdminDashboardStats
)

router.get(
  '/charts',
  authorize(ROLES.ADMIN, ROLES.STAFF),
  cacheMiddleware(120), // Cache for 2 minutes
  dashboardCtrl.getChartsData
)

module.exports = router
