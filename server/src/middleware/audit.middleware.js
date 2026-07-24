const ActivityLog = require('../models/ActivityLog.model')
const logger = require('../config/logger')

const auditMiddleware = (resourceName) => {
  return async (req, res, next) => {
    // We want to log mutations (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      // Capture the original send to intercept the response status
      const originalSend = res.send
      res.send = function (body) {
        res.send = originalSend
        
        // Asynchronously log the activity
        if (req.user) {
          const action = req.method === 'POST' ? 'CREATE' : req.method === 'DELETE' ? 'DELETE' : 'UPDATE'
          const logData = {
            user: req.user._id,
            action: action,
            resource: resourceName,
            resourceId: req.params.id || null, // Best effort to capture resource ID from params
            details: req.method !== 'DELETE' ? req.body : null,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            status: res.statusCode >= 200 && res.statusCode < 400 ? 'SUCCESS' : 'FAILURE',
          }

          ActivityLog.create(logData).catch((err) => {
            logger.error(`Failed to write audit log: ${err.message}`)
          })
        }
        
        return res.send(body)
      }
    }
    next()
  }
}

module.exports = { auditMiddleware }
