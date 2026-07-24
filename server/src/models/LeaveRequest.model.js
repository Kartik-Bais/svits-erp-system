const mongoose = require('mongoose')

const leaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    leaveType: {
      type: String,
      enum: ['Sick', 'Casual', 'Earned', 'Maternity', 'Other'],
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // HOD or Admin
    },
    remarks: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String, // e.g. medical certificate
      trim: true,
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

leaveRequestSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema)
module.exports = LeaveRequest
