const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ['Resume', 'Certificate', 'Assignment', 'IDProof', 'Other'],
      default: 'Other',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public_id for easy deletion
      required: true,
    },
    associatedModel: {
      type: String, // e.g., 'StudentProfile', 'AssignmentSubmission'
    },
    associatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

documentSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Document = mongoose.model('Document', documentSchema)
module.exports = Document
