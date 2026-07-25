/**
 * Jest manual mock for the email service.
 *
 * Place this file at:
 *   tests/__mocks__/email.service.js  ← NOT used by Jest auto-resolution
 *
 * This mock is referenced via jest.mock() in individual test files.
 * All email-sending functions become no-ops so tests never hit a real
 * SMTP server (which would fail with ECONNREFUSED in CI).
 */
const sendEmail             = jest.fn().mockResolvedValue(undefined)
const sendVerificationEmail = jest.fn().mockResolvedValue(undefined)
const sendPasswordResetEmail = jest.fn().mockResolvedValue(undefined)
const sendWelcomeEmail      = jest.fn().mockResolvedValue(undefined)
const sendReminderEmail     = jest.fn().mockResolvedValue(undefined)

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendReminderEmail,
}
