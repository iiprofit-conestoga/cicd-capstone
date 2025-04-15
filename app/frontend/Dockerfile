# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.7.0

# Copy root workspace files
COPY ../../package.json ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../pnpm-lock.yaml ./

# Copy the entire app directory to maintain workspace structure
COPY ../../app ./app

# Install dependencies using workspace
RUN pnpm install --frozen-lockfile

# Build the frontend
WORKDIR /app/app/frontend
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ../../app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 