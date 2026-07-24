const { Worker } = require('bullmq')
const { connection } = require('../config/queue')
const logger = require('../config/logger')
const emailService = require('../services/email.service')

// Only initialize the worker if Redis is connected
if (connection && connection.status === 'ready') {
  const emailWorker = new Worker('email-queue', async (job) => {
    logger.info(`Processing email job ${job.id} for ${job.name}`)
    
    const { to, name, type, message } = job.data

    try {
      if (type === 'WELCOME') {
        await emailService.sendWelcomeEmail(to, name)
      } else if (type === 'REMINDER') {
        await emailService.sendReminderEmail(to, name, message)
      } else {
        logger.warn(`Unknown email job type: ${type}`)
      }
    } catch (error) {
      logger.error(`Email job ${job.id} failed: ${error.message}`)
      throw error // Let BullMQ handle retries
    }

  }, { connection })

  emailWorker.on('completed', (job) => {
    logger.info(`Email job ${job.id} completed successfully`)
  })

  emailWorker.on('failed', (job, err) => {
    logger.error(`Email job ${job.id} failed with error: ${err.message}`)
  })
} else {
  logger.warn('Email worker not started due to missing Redis connection')
}
