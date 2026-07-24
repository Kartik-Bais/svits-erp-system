const router = require('express').Router()
const resultCtrl = require('../controllers/result.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const Joi = require('joi')
const resultSchema = require('../validators/result.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(resultCtrl.getResults)
  .post(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(
      Joi.alternatives().try(
        resultSchema.createResult,
        resultSchema.createBulkResult
      ),
      'body'
    ),
    resultCtrl.createResult
  )

router
  .route('/:id')
  .get(resultCtrl.getResultById)
  .put(
    authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD),
    validate(resultSchema.updateResult, 'body'),
    resultCtrl.updateResult
  )
  .delete(authorize(ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD), resultCtrl.deleteResult)

module.exports = router
