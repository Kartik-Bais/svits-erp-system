const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/User.model')

describe('Auth Integration Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@svits.ac.in',
    password: 'Password123!',
    role: 'STUDENT',
  }

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.data.user.email).toBe(testUser.email)
    
    // Check if user was saved to DB
    const userInDb = await User.findOne({ email: testUser.email })
    expect(userInDb).toBeTruthy()
    expect(userInDb.name).toBe(testUser.name)
  })

  it('should fail registration if user already exists', async () => {
    await User.create(testUser)

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(400) // Usually 400 for duplicate email during validation

    expect(res.body.success).toBe(false)
  })

  it('should login an existing user successfully', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser)

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
    await request(app).post('/api/v1/auth/register').send(testUser)

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword' })
      .expect(401)

    expect(res.body.success).toBe(false)
  })
})
