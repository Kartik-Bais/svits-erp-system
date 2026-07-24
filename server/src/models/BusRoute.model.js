const mongoose = require('mongoose')

const busRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
      unique: true,
    },
    vehicleNo: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      trim: true,
    },
    stops: [
      {
        name: { type: String, required: true, trim: true },
        time: { type: String, trim: true }, // e.g. "08:30 AM"
      }
    ],
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
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

busRouteSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } })
  next()
})

const BusRoute = mongoose.model('BusRoute', busRouteSchema)
module.exports = BusRoute
