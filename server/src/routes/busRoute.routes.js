const router = require('express').Router()
const busRouteCtrl = require('../controllers/busRoute.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const busRouteSchema = require('../validators/busRoute.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(busRouteCtrl.getBusRoutes)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(busRouteSchema.createBusRoute, 'body'),
    busRouteCtrl.createBusRoute
  )

router
  .route('/:id')
  .get(busRouteCtrl.getBusRouteById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(busRouteSchema.updateBusRoute, 'body'),
    busRouteCtrl.updateBusRoute
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), busRouteCtrl.deleteBusRoute)

module.exports = router
