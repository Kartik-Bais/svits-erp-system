const mongoose = require('mongoose')

const busPassSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute',
      required: [true, 'Route reference is required'],
    },
    pickupStop: {
      type: String,
      required: [true, 'Pickup stop is required'],
      trim: true,
    },
    validityStart: {
      type: Date,
      required: [true, 'Validity start date is required'],
    },
    validityEnd: {
      type: Date,
      required: [true, 'Validity end date is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Cancelled', 'Pending'],
      default: 'Pending',
    },
    feeAmount: {
      type: Number,
      required: [true, 'Fee amount is required'],
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
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

busPassSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const BusPass = mongoose.model('BusPass', busPassSchema)
module.exports = BusPass
