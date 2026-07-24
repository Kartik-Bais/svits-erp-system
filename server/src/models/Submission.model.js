const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    fileUrl: {
      type: String, // URL from Cloudinary or similar
      required: [true, 'Submission file URL is required'],
    },
    status: {
      type: String,
      enum: ['Submitted', 'Graded', 'Late'],
      default: 'Submitted',
    },
    marksObtained: {
      type: Number,
      min: 0,
    },
    feedback: {
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

// A student can only submit once per assignment (they can update it if needed)
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

submissionSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Submission = mongoose.model('Submission', submissionSchema)
module.exports = Submission
