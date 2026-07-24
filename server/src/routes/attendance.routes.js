const router = require('express').Router()
const attendanceCtrl = require('../controllers/attendance.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const Joi = require('joi')
const attendanceSchema = require('../validators/attendance.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(attendanceCtrl.getAttendance)
  .post(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(
      Joi.alternatives().try(
        attendanceSchema.createAttendance,
        attendanceSchema.createBulkAttendance
      ),
      'body'
    ),
    attendanceCtrl.createAttendance
  )

router
  .route('/:id')
  .get(attendanceCtrl.getAttendanceById)
  .put(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(attendanceSchema.updateAttendance, 'body'),
    attendanceCtrl.updateAttendance
  )
  .delete(authorize(ROLES.ADMIN), attendanceCtrl.deleteAttendance)

module.exports = router
