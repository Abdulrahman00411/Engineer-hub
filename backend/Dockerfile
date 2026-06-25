# Stage 1: Install dependencies + generate Prisma client
FROM node:20-bookworm AS deps
WORKDIR /app

# Install only production dependencies for smaller runtime image
COPY package*.json ./

# Retry logic for network issues
RUN npm ci --prefer-offline || npm ci --prefer-offline || npm install

# Copy Prisma schema and generate client (build-time)
COPY prisma ./prisma/
RUN npx prisma generate

# Stage 2: Runtime
FROM node:20-bookworm AS runner
WORKDIR /app

# Security: non-root user
RUN groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid nodejs --system nodejs

# Copy production deps + prisma artifacts + app source
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY src ./src
COPY package*.json ./

# Ensure runtime can read files
RUN chown -R nodejs:nodejs /app
USER nodejs

ENV NODE_ENV=production

EXPOSE 5000

# Health check uses the existing /api/health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]
