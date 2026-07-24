const mongoose = require('mongoose')

const savedFilterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      required: true, // e.g. 'Student', 'BookIssue'
    },
    filterQuery: {
      type: mongoose.Schema.Types.Mixed, // Storing JSON string or Object containing query params
      required: true,
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

savedFilterSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const SavedFilter = mongoose.model('SavedFilter', savedFilterSchema)
module.exports = SavedFilter
