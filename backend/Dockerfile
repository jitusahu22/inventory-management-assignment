
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./


RUN npm ci --omit=dev

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose the backend port
EXPOSE 5000

# Health check — verifies the API is responding
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1

# Start the server
CMD ["node", "server.js"]
