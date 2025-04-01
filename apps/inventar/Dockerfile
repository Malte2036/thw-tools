# Build stage
FROM node:18-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl && \
    corepack enable

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
COPY apps/inventar/package.json ./apps/inventar/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .


ARG PUBLIC_API_URL
ARG PUBLIC_KINDE_API_CLIENT
ARG PUBLIC_KINDE_DOMAIN
ARG PUBLIC_UMAMI_ENDPOINT
ARG PUBLIC_UMAMI_WEBSITEID

# Build the project
RUN pnpm build:inventar

# Use pnpm deploy to create a production bundle with only the necessary dependencies
RUN pnpm deploy --filter=thw-inventar --prod /tmp/prod

# Production stage - using Alpine for a much smaller image
FROM node:18-alpine
WORKDIR /app

# Copy just what we need from the builder stage
COPY --from=builder /tmp/prod/package.json ./package.json
COPY --from=builder /tmp/prod/node_modules ./node_modules
COPY --from=builder /app/apps/inventar/build ./build

# Set environment variables
ENV NODE_ENV=production

# Expose and run
EXPOSE 3000
CMD ["node", "build"]

