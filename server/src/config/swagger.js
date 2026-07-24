const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SVITS ERP API',
      version: '1.0.0',
      description: 'API documentation for the SVITS College Management System backend.',
      contact: {
        name: 'SVITS Admin',
        email: 'admin@svits.ac.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Document all routes
  apis: [path.join(__dirname, '../routes/*.js')],
}

const specs = swaggerJsdoc(options)

module.exports = specs
