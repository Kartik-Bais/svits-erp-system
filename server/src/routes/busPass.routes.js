const router = require('express').Router()
const busPassCtrl = require('../controllers/busPass.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const busPassSchema = require('../validators/busPass.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(busPassCtrl.getBusPasses)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(busPassSchema.createBusPass, 'body'),
    busPassCtrl.createBusPass
  )

router
  .route('/:id')
  .get(busPassCtrl.getBusPassById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(busPassSchema.updateBusPass, 'body'),
    busPassCtrl.updateBusPass
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), busPassCtrl.deleteBusPass)

module.exports = router
