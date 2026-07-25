const { Queue, Worker } = require('bullmq')
const Redis = require('ioredis')
const logger = require('./logger')

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null // Required by bullmq
}

let connection
try {
  // Use REDIS_URL if provided (common for Upstash/Render), otherwise fallback to host/port
  if (process.env.REDIS_URL) {
    connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  } else {
    connection = new Redis(redisOptions)
  }
  
  connection.on('error', (err) => {
    logger.warn('Redis connection failed. Background jobs will be unavailable.', { error: err.message })
  })
} catch (error) {
  logger.warn('Failed to initialize Redis. Queue disabled.')
}

// Instantiate Queue
const emailQueue = new Queue('email-queue', { connection })

// Helper to add jobs
const addEmailJob = async (jobName, data) => {
  if (connection && connection.status === 'ready') {
    return emailQueue.add(jobName, data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } })
  } else {
    logger.warn(`Redis not ready. Skipping job: ${jobName}`)
    return null
  }
}

// Graceful queue shutdown
const closeQueues = async () => {
  if (connection && connection.status === 'ready') {
    await emailQueue.close()
    connection.disconnect()
    logger.info('Queues and Redis connection closed')
  }
}

module.exports = {
  connection,
  emailQueue,
  addEmailJob,
  closeQueues
}
