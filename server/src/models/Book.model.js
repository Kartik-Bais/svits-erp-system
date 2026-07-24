const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    edition: {
      type: String,
      trim: true,
    },
    category: {
      type: String, // e.g., Computer Science, Mechanical, Fiction
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies are required'],
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies are required'],
      min: 0,
    },
    location: {
      type: String, // e.g., "Rack 4, Shelf B"
      trim: true,
    },
    coverImageUrl: {
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

bookSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const Book = mongoose.model('Book', bookSchema)
module.exports = Book
