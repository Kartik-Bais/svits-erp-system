const router = require('express').Router()
const hostelRoomCtrl = require('../controllers/hostelRoom.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const hostelRoomSchema = require('../validators/hostelRoom.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(hostelRoomCtrl.getHostelRooms)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF), // Staff/Hostel Warden
    validate(hostelRoomSchema.createHostelRoom, 'body'),
    hostelRoomCtrl.createHostelRoom
  )

router
  .route('/:id')
  .get(hostelRoomCtrl.getHostelRoomById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(hostelRoomSchema.updateHostelRoom, 'body'),
    hostelRoomCtrl.updateHostelRoom
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), hostelRoomCtrl.deleteHostelRoom)

module.exports = router
