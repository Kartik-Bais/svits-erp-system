const MESSAGES = Object.freeze({
  // Auth
  REGISTER_SUCCESS:       'Registration successful. Please check your email to verify your account.',
  LOGIN_SUCCESS:          'Login successful.',
  LOGOUT_SUCCESS:         'Logged out successfully.',
  TOKEN_REFRESHED:        'Access token refreshed.',
  EMAIL_VERIFIED:         'Email verified successfully.',
  PASSWORD_RESET_SENT:    'Password reset link sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful.',
  PASSWORD_CHANGED:       'Password changed successfully.',

  // User
  PROFILE_FETCHED:  'Profile fetched successfully.',
  PROFILE_UPDATED:  'Profile updated successfully.',
  ACCOUNT_DELETED:  'Account deleted successfully.',

  // Errors
  INVALID_CREDENTIALS:    'Invalid email or password.',
  EMAIL_NOT_VERIFIED:     'Please verify your email before logging in.',
  EMAIL_ALREADY_EXISTS:   'An account with this email already exists.',
  INVALID_TOKEN:          'Invalid or expired token.',
  UNAUTHORIZED:           'Authentication required.',
  FORBIDDEN:              'You do not have permission to perform this action.',
  NOT_FOUND:              'Resource not found.',
  VALIDATION_ERROR:       'Validation failed.',
  ACCOUNT_INACTIVE:       'Your account has been deactivated. Contact admin.',
  GOOGLE_AUTH_FAILED:     'Google authentication failed.',
})

module.exports = { MESSAGES }
