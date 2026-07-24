const mongoose = require('mongoose')

// Stores refresh tokens so they can be individually revoked (logout)
// without requiring short expiry times on access tokens.
const tokenSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    tokenHash: {
      type:     String,
      required: true,
      unique:   true,
    },
    expiresAt: {
      type:     Date,
      required: true,
    },
    userAgent: { type: String },
    ip:        { type: String },
  },
  { timestamps: true },
)

// MongoDB will automatically remove expired documents
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
tokenSchema.index({ user: 1 })

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token
