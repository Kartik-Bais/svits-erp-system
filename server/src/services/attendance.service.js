const Attendance = require('../models/Attendance.model')
const User = require('../models/User.model')
const Subject = require('../models/Subject.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const validateAttendanceData = async (data) => {
  const [student, subject, faculty] = await Promise.all([
    User.findById(data.student),
    Subject.findById(data.subject),
    User.findById(data.faculty),
  ])

  if (!student || student.role !== ROLES.STUDENT) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid student reference: ${data.student}`)
  }
  if (!subject) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid subject reference: ${data.subject}`)
  }
  if (!faculty || (faculty.role !== ROLES.FACULTY && faculty.role !== ROLES.HOD)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid faculty reference: ${data.faculty}`)
  }
}

const createAttendance = async (data, userId) => {
  await validateAttendanceData(data)
  
  // Normalize date to prevent duplicate errors due to time differences
  const dateObj = new Date(data.date)
  dateObj.setUTCHours(0, 0, 0, 0)
  data.date = dateObj

  const exists = await Attendance.findOne({
    student: data.student,
    subject: data.subject,
    date: data.date,
  })

  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, `Attendance already marked for student on this date`)
  }

  return Attendance.create({ ...data, createdBy: userId })
}

const createBulkAttendance = async (records, userId) => {
  // Normalize dates and validate all first
  for (const record of records) {
    const dateObj = new Date(record.date)
    dateObj.setUTCHours(0, 0, 0, 0)
    record.date = dateObj
    record.createdBy = userId
  }

  // Use insertMany with ordered: false to insert non-duplicates and ignore duplicates
  try {
    const result = await Attendance.insertMany(records, { ordered: false })
    return result
  } catch (err) {
    // Return successfully inserted docs if some failed due to uniqueness constraint
    if (err.code === 11000) {
      return err.insertedDocs || []
    }
    throw err
  }
}

const getAttendance = async (queryString) => {
  const features = new ApiFeatures(
    Attendance.find()
      .populate('student', 'name email')
      .populate('subject', 'name code')
      .populate('faculty', 'name email'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Attendance.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getAttendanceById = async (id) => {
  const attendance = await Attendance.findById(id)
    .populate('student', 'name email')
    .populate('subject', 'name code')
    .populate('faculty', 'name email')
  
  if (!attendance) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return attendance
}

const updateAttendance = async (id, data, userId) => {
  const attendance = await Attendance.findById(id)
  if (!attendance) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  Object.assign(attendance, { ...data, updatedBy: userId })
  await attendance.save()
  return attendance
}

const deleteAttendance = async (id, userId) => {
  const attendance = await Attendance.findById(id)
  if (!attendance) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  attendance.isActive = false
  attendance.updatedBy = userId
  await attendance.save()
  return attendance
}

module.exports = {
  createAttendance,
  createBulkAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
}
