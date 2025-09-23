# Build stage - uses a larger image with build tools
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl python3 make g++ && \
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
COPY apps/backend/package.json ./apps/backend/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build the project
RUN pnpm build:backend

# Create a bundle layer for dependency optimization
FROM node:20-slim AS deps-optimizer
WORKDIR /optimizer

# Copy package.json and install dependencies
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma

# Install only production dependencies
RUN npm install --omit=dev

# Generate Prisma client
RUN npx prisma generate

# Remove unnecessary engines and files to reduce size
RUN find node_modules/.prisma -type f -not -path "*libquery_engine-linux-musl*" -not -path "*libquery_engine-debian*" -delete || true
RUN rm -rf node_modules/@prisma/engines
RUN npm prune --production
RUN rm -rf node_modules/.cache

# MINIMAL CHANGE: split prisma out so node_modules can be copied without it
RUN mkdir -p /optimizer/node_modules_no_prisma \
    && cp -a node_modules/. /optimizer/node_modules_no_prisma/ \
    && rm -rf /optimizer/node_modules_no_prisma/@prisma \
              /optimizer/node_modules_no_prisma/.prisma \
    && mkdir -p /optimizer/prisma_bundle \
    && cp -a node_modules/@prisma /optimizer/prisma_bundle/@prisma \
    && cp -a node_modules/.prisma /optimizer/prisma_bundle/.prisma

# Production stage - uses Alpine for minimal size
FROM node:20-alpine AS release
WORKDIR /app

# Copy minimized node_modules from the optimizer stage
# (now in two layers: big node_modules without Prisma, then Prisma only)
COPY --from=deps-optimizer /optimizer/node_modules_no_prisma ./node_modules
COPY --from=deps-optimizer /optimizer/prisma_bundle/.prisma ./node_modules/.prisma
COPY --from=deps-optimizer /optimizer/prisma_bundle/@prisma ./node_modules/@prisma

# Copy only necessary files for runtime
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/package.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]