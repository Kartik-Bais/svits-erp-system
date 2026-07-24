const router = require('express').Router()
const departmentCtrl = require('../controllers/department.controller')
const { validate } = require('../middleware/validate.middleware')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/authorize.middleware')
const departmentSchema = require('../validators/department.validator')
const { ROLES } = require('../constants/roles')

router.use(authenticate)

router
  .route('/')
  .get(departmentCtrl.getDepartments)
  .post(
    authorize(ROLES.ADMIN),
    validate(departmentSchema.createDepartment, 'body'),
    departmentCtrl.createDepartment
  )

router
  .route('/:id')
  .get(departmentCtrl.getDepartmentById)
  .put(
    authorize(ROLES.ADMIN),
    validate(departmentSchema.updateDepartment, 'body'),
    departmentCtrl.updateDepartment
  )
  .delete(authorize(ROLES.ADMIN), departmentCtrl.deleteDepartment)

module.exports = router
