require('dotenv').config()
require('./src/config/passport') // Initialize Passport + Google Strategy
const app = require('./src/app')
const connectDB = require('./src/config/db')
const logger = require('./src/config/logger')

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  // Initialize Background Jobs and Workers
  require('./src/workers/email.worker')
  require('./src/jobs/cron').initCronJobs()

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  })

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`)
    server.close(async () => {
      logger.info('HTTP server closed')
      // Close Queues
      const { closeQueues } = require('./src/config/queue')
      await closeQueues()

      // Close Mongoose connection
      const mongoose = require('mongoose')
      await mongoose.connection.close(false)
      logger.info('MongoDB connection closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}).catch((err) => {
  logger.error('Failed to connect to database', { error: err.message })
  process.exit(1)
})

// Catch unhandled promise rejections — log and exit so the process manager can restart
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: reason?.message || reason })
  process.exit(1)
})
