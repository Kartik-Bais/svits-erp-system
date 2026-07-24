const router = require('express').Router()
const hostelAllocationCtrl = require('../controllers/hostelAllocation.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const hostelAllocationSchema = require('../validators/hostelAllocation.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(hostelAllocationCtrl.getHostelAllocations)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(hostelAllocationSchema.createHostelAllocation, 'body'),
    hostelAllocationCtrl.createHostelAllocation
  )

router
  .route('/:id')
  .get(hostelAllocationCtrl.getHostelAllocationById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(hostelAllocationSchema.updateHostelAllocation, 'body'),
    hostelAllocationCtrl.updateHostelAllocation
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), hostelAllocationCtrl.deleteHostelAllocation)

module.exports = router
