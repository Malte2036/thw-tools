FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl python3 make g++ && \
    corepack enable

# Build stage - install all dependencies and build the app
FROM base AS builder
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy packages first to leverage layer caching
COPY packages/ ./packages/

# Copy the app package.json (for dependencies)
COPY apps/backend/package.json ./apps/backend/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build the project
RUN pnpm build:backend

# Production stage
FROM base
WORKDIR /app

# Install runtime dependencies only, and generate Prisma client again in the final image
COPY apps/backend/package.json ./
COPY apps/backend/prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod
RUN npx prisma generate

# Copy compiled application
COPY --from=builder /app/apps/backend/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]