const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Semester number is required'],
      min: [1, 'Semester number must be at least 1'],
      max: [14, 'Semester number cannot exceed 14'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required (e.g., 1, 2, 3, 4)'],
      min: [1, 'Year must be at least 1'],
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

// Prevent duplicate semesters for the same course (e.g., two "Semester 1"s for B.Tech)
semesterSchema.index({ number: 1, course: 1 }, { unique: true })

semesterSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Semester = mongoose.model('Semester', semesterSchema)
module.exports = Semester
