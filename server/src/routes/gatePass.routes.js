const router = require('express').Router()
const gatePassCtrl = require('../controllers/gatePass.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const gatePassSchema = require('../validators/gatePass.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(gatePassCtrl.getGatePasses)
  .post(
    authorize(ROLES.STUDENT),
    validate(gatePassSchema.createGatePass, 'body'),
    gatePassCtrl.createGatePass
  )

router
  .route('/:id')
  .get(gatePassCtrl.getGatePassById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF, ROLES.HOD),
    validate(gatePassSchema.updateGatePass, 'body'),
    gatePassCtrl.updateGatePass
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), gatePassCtrl.deleteGatePass)

module.exports = router
