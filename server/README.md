# SVITS College ERP System - Backend

Enterprise-grade backend API for the SVITS College Management System. Built with Node.js, Express, MongoDB, and Redis.

## Features
- **Core ERP Modules**: Students, Faculty, Courses, Attendance, Results.
- **Campus Services**: Library, Transport, Hostel, Canteen, Complaints.
- **Enterprise Capabilities**: Activity Audit Logs, Dashboard Analytics, CSV Reports.
- **Campus Assistant**: Natural language AI helper (powered by Gemini) for document summarization, schedule generation, and NLP search.
- **Performance & Scalability**: Redis caching, BullMQ background jobs, rate-limiting.
- **Security**: Helmet, Express Mongo Sanitize, XSS Clean, JWT Authentication.

## Tech Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Queue/Cache**: Redis (BullMQ, ioredis, node-cache)
- **AI Integration**: Google Generative AI SDK
- **Testing**: Jest, Supertest, MongoDB Memory Server

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables and fill them in
cp .env.example .env

# Start development server with Nodemon
npm run dev
```

### Docker Setup
To instantly spin up the backend along with MongoDB and Redis:
```bash
docker-compose up -d --build
```

## Documentation
- Interactive API Docs (Swagger): `http://localhost:5000/api-docs`
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Database Schema & ER Diagrams](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## Testing
Run the comprehensive integration testing suite:
```bash
npm run test
```
