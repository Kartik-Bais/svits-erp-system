const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const hpp = require('hpp')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const swaggerUi = require('swagger-ui-express')

const routes = require('./routes/index')
const swaggerSpecs = require('./config/swagger')
const { errorHandler, notFound } = require('./middleware/error.middleware')
const logger = require('./config/logger')

const app = express()

// ── Security ──────────────────────────────────────────────────
app.use(helmet())
app.use(hpp())
app.use(mongoSanitize())
app.use(xss())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Compression ───────────────────────────────────────────────
app.use(compression())

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.use(cookieParser())

// ── HTTP Logging ──────────────────────────────────────────────
const morganStream = { write: (msg) => logger.http(msg.trim()) }
app.use(morgan('combined', { stream: morganStream }))

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// ── API Docs (Swagger) ────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1', routes)

// ── 404 + Global Error ────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
