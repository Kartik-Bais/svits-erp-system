# Stage 1: Build & Install dependencies
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies (including dev) for building if necessary
RUN npm install

COPY . .

# Stage 2: Production Image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code from builder
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./server.js
COPY --from=builder /usr/src/app/jest.config.js ./jest.config.js
# We don't copy tests/ or docs/ to keep the image lean

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
