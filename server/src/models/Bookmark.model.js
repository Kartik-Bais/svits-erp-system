const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['Notice', 'Event', 'Book'], // What is being bookmarked
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId, // Notice/Event/Book ID
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

bookmarkSchema.index({ user: 1, resourceType: 1, resourceId: 1 }, { unique: true })

bookmarkSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
module.exports = Bookmark
