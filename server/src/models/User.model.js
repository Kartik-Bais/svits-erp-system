const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const { ALL_ROLES, ROLES } = require('../constants/roles')

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type:     String,
      minlength: [8, 'Password must be at least 8 characters'],
      select:   false, // never returned in queries by default
    },
    role: {
      type:    String,
      enum:    ALL_ROLES,
      default: ROLES.STUDENT,
    },
    // Institution-specific identifiers
    rollNo:      { type: String, trim: true },
    employeeId:  { type: String, trim: true },
    department:  { type: String, trim: true },
    designation: { type: String, trim: true },

    // Profile
    avatar:      { type: String, default: null },
    phone:       { type: String, trim: true },

    // Auth state
    isEmailVerified: { type: Boolean, default: false },
    isActive:        { type: Boolean, default: true },
    isFirstLogin:    { type: Boolean, default: true },

    // Google OAuth
    googleId: { type: String, select: false },

    // Password reset (only the hash is stored)
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date,   select: false },

    // Email verification (only the hash is stored)
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpiresAt: { type: Date,   select: false },

    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password
        delete ret.googleId
        delete ret.passwordResetTokenHash
        delete ret.passwordResetExpiresAt
        delete ret.emailVerificationTokenHash
        delete ret.emailVerificationExpiresAt
        return ret
      },
    },
  },
)

// Hash password before save — only runs when the field is modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.index({ role: 1 })
userSchema.index({ googleId: 1 }, { sparse: true })

const User = mongoose.model('User', userSchema)
module.exports = User
