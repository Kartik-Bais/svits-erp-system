const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The teacher who posted it
      required: [true, 'Faculty reference is required'],
    },
    batch: {
      type: String,
      trim: true,
      default: 'All', // e.g., "IT-3A" or "All"
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    maxMarks: {
      type: Number,
      default: 10,
    },
    attachmentUrl: {
      type: String, // Cloudinary URL
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

assignmentSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Assignment = mongoose.model('Assignment', assignmentSchema)
module.exports = Assignment
