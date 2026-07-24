const { Parser } = require('json2csv')
const asyncHandler = require('../utils/asyncHandler')
const { HTTP_STATUS } = require('../constants/status')

const CanteenOrder = require('../models/CanteenOrder.model')
const StudentProfile = require('../models/StudentProfile.model')

const exportCanteenOrdersCSV = asyncHandler(async (req, res) => {
  const orders = await CanteenOrder.find({ isActive: true })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(1000) // limit for safety

  const data = orders.map(order => ({
    OrderId: order._id,
    CustomerName: order.user ? order.user.name : 'Unknown',
    TotalAmount: order.totalAmount,
    Status: order.status,
    PaymentMethod: order.paymentMethod,
    Date: order.createdAt.toISOString()
  }))

  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(data)

  res.header('Content-Type', 'text/csv')
  res.attachment('canteen_orders.csv')
  return res.status(HTTP_STATUS.OK).send(csv)
})

const exportStudentsCSV = asyncHandler(async (req, res) => {
  const students = await StudentProfile.find({ isActive: true })
    .populate('user', 'name email')
    .populate('department', 'name')
    .sort({ createdAt: -1 })
    .limit(5000)

  const data = students.map(student => ({
    EnrollmentNo: student.enrollmentNo,
    Name: student.user ? student.user.name : 'Unknown',
    Email: student.user ? student.user.email : 'Unknown',
    Department: student.department ? student.department.name : 'Unknown',
    Semester: student.currentSemester
  }))

  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(data)

  res.header('Content-Type', 'text/csv')
  res.attachment('students.csv')
  return res.status(HTTP_STATUS.OK).send(csv)
})

module.exports = {
  exportCanteenOrdersCSV,
  exportStudentsCSV
}
