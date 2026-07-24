const router = require('express').Router()
const canteenOrderCtrl = require('../controllers/canteenOrder.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const canteenOrderSchema = require('../validators/canteenOrder.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(canteenOrderCtrl.getCanteenOrders)
  .post(
    validate(canteenOrderSchema.createCanteenOrder, 'body'),
    canteenOrderCtrl.createCanteenOrder
  )

router
  .route('/:id')
  .get(canteenOrderCtrl.getCanteenOrderById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF), // Canteen staff
    validate(canteenOrderSchema.updateCanteenOrder, 'body'),
    canteenOrderCtrl.updateCanteenOrder
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), canteenOrderCtrl.deleteCanteenOrder)

module.exports = router
