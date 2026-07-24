const mongoose = require('mongoose')

const libraryFineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    bookIssue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookIssue',
      required: [true, 'Book issue reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Fine amount is required'],
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Waived'],
      default: 'Pending',
    },
    paymentDate: {
      type: Date, // Null if pending
    },
    remarks: {
      type: String, // E.g. "Late by 5 days", "Paid via cash"
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

libraryFineSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const LibraryFine = mongoose.model('LibraryFine', libraryFineSchema)
module.exports = LibraryFine
