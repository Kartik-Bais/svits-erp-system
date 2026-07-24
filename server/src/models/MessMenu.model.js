const mongoose = require('mongoose')

const messMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Day is required'],
      unique: true,
    },
    breakfast: {
      type: String,
      trim: true,
      default: 'Not Specified',
    },
    lunch: {
      type: String,
      trim: true,
      default: 'Not Specified',
    },
    snacks: {
      type: String,
      trim: true,
      default: 'Not Specified',
    },
    dinner: {
      type: String,
      trim: true,
      default: 'Not Specified',
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

messMenuSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const MessMenu = mongoose.model('MessMenu', messMenuSchema)
module.exports = MessMenu
