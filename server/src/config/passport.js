const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const User = require('../models/User.model')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'https://svits-erp-system.onrender.com'}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Try to find existing user by googleId
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          // Check if a user already exists with this email (linked account)
          user = await User.findOne({ email: profile.emails[0].value })

          if (user) {
            // Do not link automatically. Tell user to sign in with password.
            return cb(new Error('email_exists'), null)
          } else {
            // Create a brand new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0]?.value || null,
              isEmailVerified: true, // Google already verified the email
            })
          }
        }

        return cb(null, user)
      } catch (error) {
        return cb(error, null)
      }
    }
  )
)

module.exports = passport
