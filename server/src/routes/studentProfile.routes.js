const router = require('express').Router()
const profileCtrl = require('../controllers/studentProfile.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const profileSchema = require('../validators/studentProfile.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(authorize(ROLES.ADMIN, ROLES.FACULTY), profileCtrl.getStudentProfiles)
  .post(
    authorize(ROLES.ADMIN),
    validate(profileSchema.createStudentProfile, 'body'),
    profileCtrl.createStudentProfile
  )

router
  .route('/:id')
  .get(profileCtrl.getStudentProfileById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STUDENT),
    validate(profileSchema.updateStudentProfile, 'body'),
    profileCtrl.updateStudentProfile
  )
  .delete(authorize(ROLES.ADMIN), profileCtrl.deleteStudentProfile)

module.exports = router
