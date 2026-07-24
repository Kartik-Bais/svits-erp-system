const mongoose = require('mongoose')

const assistantConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Usually, one ongoing history per user for the generic campus assistant
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'model'],
          required: true
        },
        content: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

assistantConversationSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const AssistantConversation = mongoose.model('AssistantConversation', assistantConversationSchema)
module.exports = AssistantConversation
