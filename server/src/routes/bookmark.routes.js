const router = require('express').Router()
const bookmarkCtrl = require('../controllers/bookmark.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const bookmarkSchema = require('../validators/bookmark.validator')

router.use(authenticate)

router
  .route('/')
  .get(bookmarkCtrl.getBookmarks)
  .post(
    validate(bookmarkSchema.createBookmark, 'body'),
    bookmarkCtrl.toggleBookmark
  )

module.exports = router
