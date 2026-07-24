const router = require('express').Router()
const timetableCtrl = require('../controllers/timetable.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const timetableSchema = require('../validators/timetable.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(timetableCtrl.getTimetables)
  .post(
    authorize(ROLES.ADMIN, ROLES.HOD),
    validate(timetableSchema.createTimetable, 'body'),
    timetableCtrl.createTimetable
  )

router
  .route('/:id')
  .get(timetableCtrl.getTimetableById)
  .put(
    authorize(ROLES.ADMIN, ROLES.HOD),
    validate(timetableSchema.updateTimetable, 'body'),
    timetableCtrl.updateTimetable
  )
  .delete(authorize(ROLES.ADMIN, ROLES.HOD), timetableCtrl.deleteTimetable)

module.exports = router
