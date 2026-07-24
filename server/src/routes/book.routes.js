const router = require('express').Router()
const bookCtrl = require('../controllers/book.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const bookSchema = require('../validators/book.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(bookCtrl.getBooks)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF), // Assuming Staff includes Librarian
    validate(bookSchema.createBook, 'body'),
    bookCtrl.createBook
  )

router
  .route('/:id')
  .get(bookCtrl.getBookById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(bookSchema.updateBook, 'body'),
    bookCtrl.updateBook
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), bookCtrl.deleteBook)

module.exports = router
