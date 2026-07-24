# Deployment Guide

The SVITS ERP Backend is containerized and optimized for cloud deployment.

## Option A: Docker Compose (Recommended for VPS/EC2)

1. **Clone the repository** to your production server.
2. **Configure Environment Variables**:
   ```bash
   cd server
   cp .env.example .env
   nano .env
   # Ensure PORT=5000, NODE_ENV=production, and MONGODB_URI/REDIS_HOST are set to point to the docker network aliases (e.g. mongodb://mongo:27017)
   ```
3. **Start the cluster**:
   ```bash
   docker-compose up -d --build
   ```
4. **Reverse Proxy (NGINX)**:
   Point your domain's NGINX configuration to `http://localhost:5000`. Set `client_max_body_size` high enough to allow document uploads.

## Option B: Managed Services (Heroku / Render)

1. Provision a managed **MongoDB Atlas** cluster.
2. Provision a managed **Redis** instance (e.g., Upstash).
3. Connect your GitHub repository to Render/Heroku.
4. Set the build command to `npm install --legacy-peer-deps`.
5. Set the start command to `node server.js`.
6. Inject all environment variables into the platform's dashboard.

## Health Checks
Once deployed, verify the system is online by hitting:
`GET https://api.yourdomain.com/health`

It should return `{ "status": "ok" }`.
