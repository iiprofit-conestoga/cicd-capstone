# Use Node.js 18 Alpine as the base image
FROM --platform=linux/amd64 node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.7.0

# Copy only package files first
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy only the necessary workspace packages
COPY packages/utils ./packages/utils
COPY app/backend ./app/backend

# Install dependencies using workspace
RUN pnpm install --frozen-lockfile

# Production image
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.7.0

# Copy only the necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app ./app
COPY --from=builder /app/packages ./packages
COPY package.json pnpm-workspace.yaml ./

# Set working directory to backend
WORKDIR /app/app/backend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 