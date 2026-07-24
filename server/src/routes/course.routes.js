const router = require('express').Router()
const courseCtrl = require('../controllers/course.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const courseSchema = require('../validators/course.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(courseCtrl.getCourses)
  .post(
    authorize(ROLES.ADMIN),
    validate(courseSchema.createCourse, 'body'),
    courseCtrl.createCourse
  )

router
  .route('/:id')
  .get(courseCtrl.getCourseById)
  .put(
    authorize(ROLES.ADMIN),
    validate(courseSchema.updateCourse, 'body'),
    courseCtrl.updateCourse
  )
  .delete(authorize(ROLES.ADMIN), courseCtrl.deleteCourse)

module.exports = router
