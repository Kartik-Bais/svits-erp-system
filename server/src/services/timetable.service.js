const Timetable = require('../models/Timetable.model')
const Course = require('../models/Course.model')
const Semester = require('../models/Semester.model')
const Subject = require('../models/Subject.model')
const User = require('../models/User.model')
const ApiFeatures = require('../utils/ApiFeatures.util')
const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES } = require('../constants/messages')
const { ROLES } = require('../constants/roles')

const validateRelations = async (data) => {
  const [course, semester, subject, faculty] = await Promise.all([
    Course.findById(data.course),
    Semester.findById(data.semester),
    Subject.findById(data.subject),
    User.findById(data.faculty),
  ])

  if (!course) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found')
  if (!semester) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Semester not found')
  if (!subject) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Subject not found')
  if (!faculty) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Faculty not found')
  if (faculty.role !== ROLES.FACULTY && faculty.role !== ROLES.HOD) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Assigned user is not a faculty member')
  }

  if (semester.course.toString() !== course._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Semester does not belong to course')
  }
  if (subject.semester.toString() !== semester._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Subject does not belong to semester')
  }
}

const createTimetable = async (data, userId) => {
  await validateRelations(data)

  // Check for room conflict
  const roomConflict = await Timetable.findOne({
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    room: data.room,
  })
  if (roomConflict) throw new ApiError(HTTP_STATUS.CONFLICT, 'Room is already booked for this time')

  // Check for faculty conflict
  const facultyConflict = await Timetable.findOne({
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    faculty: data.faculty,
  })
  if (facultyConflict) throw new ApiError(HTTP_STATUS.CONFLICT, 'Faculty is already assigned to a class at this time')

  return Timetable.create({ ...data, createdBy: userId })
}

const getTimetables = async (queryString) => {
  const features = new ApiFeatures(
    Timetable.find()
      .populate('course', 'name code')
      .populate('semester', 'number year')
      .populate('subject', 'name code type')
      .populate('faculty', 'name email'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    Timetable.countDocuments(features.query.getFilter()),
  ])

  return { data, total }
}

const getTimetableById = async (id) => {
  const timetable = await Timetable.findById(id)
    .populate('course', 'name code')
    .populate('semester', 'number year')
    .populate('subject', 'name code type')
    .populate('faculty', 'name email')
  
  if (!timetable) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
  return timetable
}

const updateTimetable = async (id, data, userId) => {
  const timetable = await Timetable.findById(id)
  if (!timetable) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  // Simplified: Validate full object relationships if any relation changes
  if (data.course || data.semester || data.subject || data.faculty) {
    const checkData = {
      course: data.course || timetable.course,
      semester: data.semester || timetable.semester,
      subject: data.subject || timetable.subject,
      faculty: data.faculty || timetable.faculty,
    }
    await validateRelations(checkData)
  }

  // Conflict checking on update
  if (data.dayOfWeek || data.startTime || data.room || data.faculty) {
    const day = data.dayOfWeek || timetable.dayOfWeek
    const time = data.startTime || timetable.startTime
    
    if (data.room || data.dayOfWeek || data.startTime) {
      const roomConflict = await Timetable.findOne({ _id: { $ne: id }, dayOfWeek: day, startTime: time, room: data.room || timetable.room })
      if (roomConflict) throw new ApiError(HTTP_STATUS.CONFLICT, 'Room is already booked')
    }

    if (data.faculty || data.dayOfWeek || data.startTime) {
      const facConflict = await Timetable.findOne({ _id: { $ne: id }, dayOfWeek: day, startTime: time, faculty: data.faculty || timetable.faculty })
      if (facConflict) throw new ApiError(HTTP_STATUS.CONFLICT, 'Faculty is already booked')
    }
  }

  Object.assign(timetable, { ...data, updatedBy: userId })
  await timetable.save()
  return timetable
}

const deleteTimetable = async (id, userId) => {
  const timetable = await Timetable.findById(id)
  if (!timetable) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)

  timetable.isActive = false
  timetable.updatedBy = userId
  await timetable.save()
  return timetable
}

module.exports = {
  createTimetable,
  getTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
}
