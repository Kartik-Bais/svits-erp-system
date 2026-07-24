const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester reference is required'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Minimum 1 credit'],
      max: [10, 'Maximum 10 credits'],
    },
    type: {
      type: String,
      enum: ['Theory', 'Lab', 'Project', 'Seminar'],
      default: 'Theory',
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

subjectSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Subject = mongoose.model('Subject', subjectSchema)
module.exports = Subject
