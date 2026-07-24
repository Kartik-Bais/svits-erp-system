const router = require('express').Router()
const canteenItemCtrl = require('../controllers/canteenItem.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const canteenItemSchema = require('../validators/canteenItem.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(canteenItemCtrl.getCanteenItems) // Anyone can view items
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(canteenItemSchema.createCanteenItem, 'body'),
    canteenItemCtrl.createCanteenItem
  )

router
  .route('/:id')
  .get(canteenItemCtrl.getCanteenItemById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(canteenItemSchema.updateCanteenItem, 'body'),
    canteenItemCtrl.updateCanteenItem
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), canteenItemCtrl.deleteCanteenItem)

module.exports = router
