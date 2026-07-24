const mongoose = require('mongoose')

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String, // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
      required: true,
    },
    resource: {
      type: String, // e.g., 'StudentProfile', 'BookIssue'
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId, // The ID of the document changed
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Request body, changes, or query
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      default: 'SUCCESS',
    },
  },
  {
    timestamps: true, // we want to know exactly when this happened
  }
)

// We usually do not hard-delete or soft-delete audit logs, but we'll add isActive for consistency
activityLogSchema.add({
  isActive: {
    type: Boolean,
    default: true,
  },
})

activityLogSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)
module.exports = ActivityLog
