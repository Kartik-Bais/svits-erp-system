const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The student
      required: [true, 'Student reference is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The teacher who marked it
      required: [true, 'Faculty reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      required: [true, 'Status is required'],
    },
    remarks: {
      type: String,
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

// Prevent duplicate attendance entry for same student, subject, and date
attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true })

attendanceSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Attendance = mongoose.model('Attendance', attendanceSchema)
module.exports = Attendance
