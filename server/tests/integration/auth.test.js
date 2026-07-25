// Mock the email service BEFORE importing app so nodemailer never fires
// Author: Kartikbais | Profession: web developer

jest.mock('../../src/services/email.service')

// Set required env vars for JWT token generation
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_access_secret_for_ci'
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_for_ci'
process.env.JWT_ACCESS_EXPIRES = '15m'
process.env.JWT_REFRESH_EXPIRES = '7d'

const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/User.model')

describe('Auth Integration Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@svits.ac.in',
    password: 'Password123!',
    role: 'student',
  }

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201)

    expect(res.body.success).toBe(true)
    // Register returns { id } not { user } — just check the id exists
    expect(res.body.data.id).toBeDefined()

    // Check if user was saved to DB
    const userInDb = await User.findOne({ email: testUser.email })
    expect(userInDb).toBeTruthy()
    expect(userInDb.name).toBe(testUser.name)
  })

  it('should fail registration if user already exists', async () => {
    await User.create({ ...testUser, isEmailVerified: true })

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(409) // Server returns 409 Conflict for duplicate email

    expect(res.body.success).toBe(false)
  })

  it('should login an existing user successfully', async () => {
    // Register first (email mock prevents SMTP crash)
    await request(app).post('/api/v1/auth/register').send(testUser)

    // Manually verify the email — the login endpoint enforces isEmailVerified
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isEmailVerified: true }
    )

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.user).toBeDefined()
    // Should set a cookie
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('should fail login with incorrect password', async () => {
    // Register and verify
    await request(app).post('/api/v1/auth/register').send(testUser)
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isEmailVerified: true }
    )

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword' })
      .expect(401)

    expect(res.body.success).toBe(false)
  })
})
