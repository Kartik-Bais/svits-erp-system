const router = require('express').Router()
const searchCtrl = require('../controllers/search.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { cacheMiddleware } = require('../utils/cache.util')

router.use(authenticate)

router.get('/global', cacheMiddleware(60), searchCtrl.globalSearch)

module.exports = router
