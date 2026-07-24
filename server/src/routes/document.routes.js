const router = require('express').Router()
const documentCtrl = require('../controllers/document.controller')
const upload = require('../middleware/upload.middleware')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const documentSchema = require('../validators/document.validator')

router.use(authenticate)

router
  .route('/')
  .get(documentCtrl.getDocuments)
  .post(
    upload.single('document'), // The field name in multipart/form-data must be 'document'
    validate(documentSchema.createDocument, 'body'),
    documentCtrl.uploadDocument
  )

router.delete('/:id', documentCtrl.deleteDocument)

module.exports = router
