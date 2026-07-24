const mongoose = require('mongoose')

const hostelRoomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    block: {
      type: String,
      required: [true, 'Block is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
    type: {
      type: String,
      enum: ['AC', 'Non-AC'],
      default: 'Non-AC',
    },
    feePerSemester: {
      type: Number,
      required: [true, 'Fee per semester is required'],
      min: 0,
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

// A room number must be unique within a block
hostelRoomSchema.index({ roomNo: 1, block: 1 }, { unique: true })

hostelRoomSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const HostelRoom = mongoose.model('HostelRoom', hostelRoomSchema)
module.exports = HostelRoom
