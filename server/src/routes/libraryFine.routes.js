const router = require('express').Router()
const libraryFineCtrl = require('../controllers/libraryFine.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const libraryFineSchema = require('../validators/libraryFine.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(libraryFineCtrl.getLibraryFines)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(libraryFineSchema.createLibraryFine, 'body'),
    libraryFineCtrl.createLibraryFine
  )

router
  .route('/:id')
  .get(libraryFineCtrl.getLibraryFineById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(libraryFineSchema.updateLibraryFine, 'body'),
    libraryFineCtrl.updateLibraryFine
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), libraryFineCtrl.deleteLibraryFine)

module.exports = router
