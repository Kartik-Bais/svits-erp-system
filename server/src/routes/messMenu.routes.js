const router = require('express').Router()
const messMenuCtrl = require('../controllers/messMenu.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const messMenuSchema = require('../validators/messMenu.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(messMenuCtrl.getMessMenus) // Anyone can view the menu
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(messMenuSchema.createMessMenu, 'body'),
    messMenuCtrl.createMessMenu
  )

router
  .route('/:id')
  .get(messMenuCtrl.getMessMenuById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(messMenuSchema.updateMessMenu, 'body'),
    messMenuCtrl.updateMessMenu
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), messMenuCtrl.deleteMessMenu)

module.exports = router
