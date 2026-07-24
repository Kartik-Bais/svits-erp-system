const nodemailer = require('nodemailer')
const logger     = require('../config/logger')

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
  logger.info(`Email sent to ${to} — messageId: ${info.messageId}`)
}

const sendVerificationEmail = (to, token) =>
  sendEmail({
    to,
    subject: 'Verify your SVITS ERP account',
    html: `
      <p>Hello,</p>
      <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
      <a href="${process.env.CLIENT_URL}/verify-email?token=${token}"
         style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
        Verify Email
      </a>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `,
  })

const sendPasswordResetEmail = (to, token) =>
  sendEmail({
    to,
    subject: 'Reset your SVITS ERP password',
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click below to set a new password. This link expires in ${process.env.RESET_TOKEN_EXPIRES_MINUTES || 15} minutes.</p>
      <a href="${process.env.CLIENT_URL}/reset-password?token=${token}"
         style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
    `,
  })

const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to SVITS ERP'
  const html = `
    <h2>Hello ${name},</h2>
    <p>Welcome to the SVITS College ERP System.</p>
    <p>Your account has been successfully created. You can now log in to the portal using your credentials.</p>
  `
  return sendEmail({ to: email, subject, html })
}

const sendReminderEmail = async (email, name, message) => {
  const subject = 'Reminder: SVITS ERP'
  const html = `
    <h2>Hello ${name},</h2>
    <p>This is a reminder regarding:</p>
    <p><strong>${message}</strong></p>
  `
  return sendEmail({ to: email, subject, html })
}

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendReminderEmail }
