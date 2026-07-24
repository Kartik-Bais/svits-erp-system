const router = require('express').Router()
const profileCtrl = require('../controllers/facultyProfile.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const profileSchema = require('../validators/facultyProfile.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(profileCtrl.getFacultyProfiles)
  .post(
    authorize(ROLES.ADMIN),
    validate(profileSchema.createFacultyProfile, 'body'),
    profileCtrl.createFacultyProfile
  )

router
  .route('/:id')
  .get(profileCtrl.getFacultyProfileById)
  .put(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(profileSchema.updateFacultyProfile, 'body'),
    profileCtrl.updateFacultyProfile
  )
  .delete(authorize(ROLES.ADMIN), profileCtrl.deleteFacultyProfile)

module.exports = router
