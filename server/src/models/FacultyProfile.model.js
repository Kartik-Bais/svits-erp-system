const mongoose = require('mongoose')

const facultyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    joinedDate: {
      type: Date,
      required: [true, 'Joined date is required'],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    leaveBalance: {
      type: Number,
      default: 12, // Default annual leave
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    address: { type: String, trim: true },
    
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

facultyProfileSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const FacultyProfile = mongoose.model('FacultyProfile', facultyProfileSchema)
module.exports = FacultyProfile
