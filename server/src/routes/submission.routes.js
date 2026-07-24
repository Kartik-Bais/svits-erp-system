const router = require('express').Router()
const submissionCtrl = require('../controllers/submission.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const submissionSchema = require('../validators/submission.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(submissionCtrl.getSubmissions)
  .post(
    authorize(ROLES.STUDENT),
    validate(submissionSchema.createSubmission, 'body'),
    submissionCtrl.createSubmission
  )

router
  .route('/:id')
  .get(submissionCtrl.getSubmissionById)
  .put(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(submissionSchema.updateSubmission, 'body'),
    submissionCtrl.updateSubmission
  )
  .delete(authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD), submissionCtrl.deleteSubmission)

module.exports = router
