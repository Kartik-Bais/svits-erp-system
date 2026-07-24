const mongoose = require('mongoose')

const hostelAllocationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelRoom',
      required: [true, 'Room reference is required'],
    },
    joinedDate: {
      type: Date,
      required: [true, 'Joined date is required'],
    },
    leftDate: {
      type: Date, // Null if currently allocated
    },
    status: {
      type: String,
      enum: ['Allocated', 'Vacated'],
      default: 'Allocated',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial'],
      default: 'Pending',
    },
    remarks: {
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

hostelAllocationSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const HostelAllocation = mongoose.model('HostelAllocation', hostelAllocationSchema)
module.exports = HostelAllocation
