# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Install necessary runtime dependencies
RUN apk add --no-cache curl

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001

# Copy from builder
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodeapp:nodejs /app/src ./src
COPY --from=builder --chown=nodeapp:nodejs /app/server.js ./
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./

USER nodeapp
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
