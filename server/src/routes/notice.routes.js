const router = require('express').Router()
const noticeCtrl = require('../controllers/notice.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const noticeSchema = require('../validators/notice.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(noticeCtrl.getNotices) // Any authenticated user can view notices (filtering logic applies)
  .post(
    authorize(ROLES.ADMIN, ROLES.HOD, ROLES.STAFF),
    validate(noticeSchema.createNotice, 'body'),
    noticeCtrl.createNotice
  )

router
  .route('/:id')
  .get(noticeCtrl.getNoticeById)
  .put(
    authorize(ROLES.ADMIN, ROLES.HOD, ROLES.STAFF),
    validate(noticeSchema.updateNotice, 'body'),
    noticeCtrl.updateNotice
  )
  .delete(authorize(ROLES.ADMIN, ROLES.HOD), noticeCtrl.deleteNotice)

module.exports = router
