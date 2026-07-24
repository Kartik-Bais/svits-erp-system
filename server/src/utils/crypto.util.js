const crypto = require('crypto')

/**
 * Generates a cryptographically secure random token.
 * Returns both the raw token (sent to the user) and its SHA-256
 * hash (stored in the database so the raw value is never persisted).
 */
const generateSecureToken = () => {
  const raw    = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, hashed }
}

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex')

module.exports = { generateSecureToken, hashToken }
