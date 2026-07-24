const router = require('express').Router()
const examinationCtrl = require('../controllers/examination.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const examinationSchema = require('../validators/examination.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(examinationCtrl.getExaminations)
  .post(
    authorize(ROLES.ADMIN, ROLES.HOD),
    validate(examinationSchema.createExamination, 'body'),
    examinationCtrl.createExamination
  )

router
  .route('/:id')
  .get(examinationCtrl.getExaminationById)
  .put(
    authorize(ROLES.ADMIN, ROLES.HOD),
    validate(examinationSchema.updateExamination, 'body'),
    examinationCtrl.updateExamination
  )
  .delete(authorize(ROLES.ADMIN, ROLES.HOD), examinationCtrl.deleteExamination)

module.exports = router
