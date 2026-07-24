const router = require('express').Router()
const complaintCtrl = require('../controllers/complaint.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const complaintSchema = require('../validators/complaint.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(complaintCtrl.getComplaints)
  .post(
    validate(complaintSchema.createComplaint, 'body'),
    complaintCtrl.createComplaint
  )

router
  .route('/:id')
  .get(complaintCtrl.getComplaintById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(complaintSchema.updateComplaint, 'body'),
    complaintCtrl.updateComplaint
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), complaintCtrl.deleteComplaint)

module.exports = router
