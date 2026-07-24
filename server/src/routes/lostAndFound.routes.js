const router = require('express').Router()
const lostAndFoundCtrl = require('../controllers/lostAndFound.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const lostAndFoundSchema = require('../validators/lostAndFound.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(lostAndFoundCtrl.getLostAndFounds)
  .post(
    validate(lostAndFoundSchema.createLostAndFound, 'body'),
    lostAndFoundCtrl.createLostAndFound
  )

router
  .route('/:id')
  .get(lostAndFoundCtrl.getLostAndFoundById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF), // Only staff admin can update status
    validate(lostAndFoundSchema.updateLostAndFound, 'body'),
    lostAndFoundCtrl.updateLostAndFound
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), lostAndFoundCtrl.deleteLostAndFound)

module.exports = router
