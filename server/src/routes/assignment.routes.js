const router = require('express').Router()
const assignmentCtrl = require('../controllers/assignment.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const assignmentSchema = require('../validators/assignment.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(assignmentCtrl.getAssignments)
  .post(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(assignmentSchema.createAssignment, 'body'),
    assignmentCtrl.createAssignment
  )

router
  .route('/:id')
  .get(assignmentCtrl.getAssignmentById)
  .put(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(assignmentSchema.updateAssignment, 'body'),
    assignmentCtrl.updateAssignment
  )
  .delete(authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD), assignmentCtrl.deleteAssignment)

module.exports = router
