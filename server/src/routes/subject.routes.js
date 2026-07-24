const router = require('express').Router()
const subjectCtrl = require('../controllers/subject.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const subjectSchema = require('../validators/subject.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(subjectCtrl.getSubjects)
  .post(
    authorize(ROLES.ADMIN),
    validate(subjectSchema.createSubject, 'body'),
    subjectCtrl.createSubject
  )

router
  .route('/:id')
  .get(subjectCtrl.getSubjectById)
  .put(
    authorize(ROLES.ADMIN),
    validate(subjectSchema.updateSubject, 'body'),
    subjectCtrl.updateSubject
  )
  .delete(authorize(ROLES.ADMIN), subjectCtrl.deleteSubject)

module.exports = router
