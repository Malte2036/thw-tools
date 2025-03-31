# Build stage
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@latest

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
COPY apps/thw-tools/package.json ./apps/thw-tools/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .

# Define ARGs for build-time environment variables
ARG PUBLIC_API_URL
ARG PUBLIC_KINDE_API_CLIENT
ARG PUBLIC_KINDE_DOMAIN
ARG PUBLIC_UMAMI_ENDPOINT
ARG PUBLIC_UMAMI_WEBSITEID

# Set environment variables for the build process
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_KINDE_API_CLIENT=${PUBLIC_KINDE_API_CLIENT}
ENV PUBLIC_KINDE_DOMAIN=${PUBLIC_KINDE_DOMAIN}
ENV PUBLIC_UMAMI_ENDPOINT=${PUBLIC_UMAMI_ENDPOINT}
ENV PUBLIC_UMAMI_WEBSITEID=${PUBLIC_UMAMI_WEBSITEID}

# Build the project
RUN pnpm build:thw-tools

# Use pnpm deploy to create a production bundle with only the necessary dependencies
RUN pnpm deploy --filter=thw-tools --prod /tmp/prod

# Production stage - using Alpine for a much smaller image
FROM node:20-alpine
WORKDIR /app

# Copy just what we need from the builder stage
COPY --from=builder /tmp/prod/package.json ./package.json
COPY --from=builder /tmp/prod/node_modules ./node_modules
COPY --from=builder /app/apps/thw-tools/build ./build

# Set environment variables
ENV NODE_ENV=production

# Expose and run
EXPOSE 3000
CMD ["node", "build"]