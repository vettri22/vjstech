# Multi-stage production build for VJS TECH
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY client ./client
COPY server ./server

# Build production client and server
RUN npm run build

# Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/

# Install production dependencies only for server
RUN npm --prefix server install --omit=dev

# Copy compiled bundles
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/server/dist ./server/dist

# Create persistent data and uploads directory
RUN mkdir -p /app/server/data /app/server/uploads

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "dist/index.js"]
