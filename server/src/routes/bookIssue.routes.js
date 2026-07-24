const router = require('express').Router()
const bookIssueCtrl = require('../controllers/bookIssue.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const bookIssueSchema = require('../validators/bookIssue.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(bookIssueCtrl.getBookIssues)
  .post(
    authorize(ROLES.ADMIN, ROLES.STAFF), // Staff/Librarian
    validate(bookIssueSchema.issueBook, 'body'),
    bookIssueCtrl.issueBook
  )

router.put(
  '/:id/return',
  authorize(ROLES.ADMIN, ROLES.STAFF),
  validate(bookIssueSchema.returnBook, 'body'),
  bookIssueCtrl.returnBook
)

router.put(
  '/:id/renew',
  authorize(ROLES.ADMIN, ROLES.STAFF, ROLES.STUDENT, ROLES.FACULTY), // Users can renew their own
  validate(bookIssueSchema.renewBook, 'body'),
  bookIssueCtrl.renewBook
)

router
  .route('/:id')
  .get(bookIssueCtrl.getBookIssueById)
  .put(
    authorize(ROLES.ADMIN, ROLES.STAFF),
    validate(bookIssueSchema.updateBookIssue, 'body'),
    bookIssueCtrl.updateBookIssue
  )
  .delete(authorize(ROLES.ADMIN, ROLES.STAFF), bookIssueCtrl.deleteBookIssue)

module.exports = router
