const router = require('express').Router()
const savedFilterCtrl = require('../controllers/savedFilter.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const savedFilterSchema = require('../validators/savedFilter.validator')

router.use(authenticate)

router
  .route('/')
  .get(savedFilterCtrl.getSavedFilters)
  .post(
    validate(savedFilterSchema.createSavedFilter, 'body'),
    savedFilterCtrl.createSavedFilter
  )

router.delete('/:id', savedFilterCtrl.deleteSavedFilter)

module.exports = router
