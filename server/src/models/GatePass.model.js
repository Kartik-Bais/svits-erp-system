const mongoose = require('mongoose')

const gatePassSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    outTime: {
      type: Date,
      required: [true, 'Out time is required'],
    },
    expectedInTime: {
      type: Date,
      required: [true, 'Expected in time is required'],
    },
    actualInTime: {
      type: Date, // Null until they return
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Out', 'Returned'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Usually a Warden or HOD
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

gatePassSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const GatePass = mongoose.model('GatePass', gatePassSchema)
module.exports = GatePass
