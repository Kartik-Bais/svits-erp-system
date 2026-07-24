const router       = require('express').Router()
const userCtrl     = require('../controllers/user.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize }    = require('../middleware/authorize.middleware')
const { ROLES }        = require('../constants/roles')

// All routes here require authentication
router.use(authenticate)

// Current User Profile
router.get('/me',    userCtrl.getProfile)
router.patch('/me',  userCtrl.updateProfile)
router.delete('/me', userCtrl.deleteAccount)

// Admin Only
router.get('/:id', authorize(ROLES.ADMIN), userCtrl.getUserById)

module.exports = router
