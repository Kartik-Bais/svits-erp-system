const ActivityLog = require('../models/ActivityLog.model')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const ApiFeatures = require('../utils/ApiFeatures.util')
const { HTTP_STATUS } = require('../constants/status')

const getActivityLogs = asyncHandler(async (req, res) => {
  let query = ActivityLog.find().populate('user', 'name email role')

  if (req.query.startDate && req.query.endDate) {
    query = query.find({
      createdAt: {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      },
    })
  }

  const features = new ApiFeatures(query, req.query)
    .filter()
    .sort()
    .paginate()

  const [data, total] = await Promise.all([
    features.query,
    ActivityLog.countDocuments(features.query.getFilter()),
  ])

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Activity logs fetched successfully', { total, data }))
})

module.exports = {
  getActivityLogs,
}
