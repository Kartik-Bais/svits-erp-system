const router = require('express').Router()
const eventCtrl = require('../controllers/event.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const eventSchema = require('../validators/event.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(eventCtrl.getEvents)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(eventSchema.createEvent, 'body'),
    eventCtrl.createEvent
  )

router
  .route('/:id')
  .get(eventCtrl.getEventById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(eventSchema.updateEvent, 'body'),
    eventCtrl.updateEvent
  )
  .delete(authorize(ROLES.ADMIN), eventCtrl.deleteEvent)

module.exports = router
