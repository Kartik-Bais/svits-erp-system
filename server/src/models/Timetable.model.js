const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester is required'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      default: 'A',
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The teacher assigned
      required: [true, 'Faculty is required'],
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Day of week is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g., 09:00)'],
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // HH:MM 24-hour format
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g., 10:30)'],
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    room: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// Ensure no identical schedule for the exact same batch/room/time
timetableSchema.index({ dayOfWeek: 1, startTime: 1, room: 1 }, { unique: true })
timetableSchema.index({ dayOfWeek: 1, startTime: 1, faculty: 1 }, { unique: true })

timetableSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Timetable = mongoose.model('Timetable', timetableSchema)
module.exports = Timetable
