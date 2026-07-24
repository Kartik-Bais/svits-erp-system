const router = require('express').Router()
const semesterCtrl = require('../controllers/semester.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const semesterSchema = require('../validators/semester.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(semesterCtrl.getSemesters)
  .post(
    authorize(ROLES.ADMIN),
    validate(semesterSchema.createSemester, 'body'),
    semesterCtrl.createSemester
  )

router
  .route('/:id')
  .get(semesterCtrl.getSemesterById)
  .put(
    authorize(ROLES.ADMIN),
    validate(semesterSchema.updateSemester, 'body'),
    semesterCtrl.updateSemester
  )
  .delete(authorize(ROLES.ADMIN), semesterCtrl.deleteSemester)

module.exports = router
