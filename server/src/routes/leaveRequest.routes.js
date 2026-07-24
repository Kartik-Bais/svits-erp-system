const router = require('express').Router()
const leaveRequestCtrl = require('../controllers/leaveRequest.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const leaveRequestSchema = require('../validators/leaveRequest.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(leaveRequestCtrl.getLeaveRequests) // Allows HR to view all, or users to view own via query param
  .post(
    validate(leaveRequestSchema.createLeaveRequest, 'body'),
    leaveRequestCtrl.createLeaveRequest
  )

router
  .route('/:id')
  .get(leaveRequestCtrl.getLeaveRequestById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF, ROLES.HOD),
    validate(leaveRequestSchema.updateLeaveRequest, 'body'),
    leaveRequestCtrl.updateLeaveRequest
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), leaveRequestCtrl.deleteLeaveRequest)

module.exports = router
