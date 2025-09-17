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
COPY apps/inventar-next/package.json ./apps/inventar-next/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the remaining source code
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KINDE_API_CLIENT
ARG NEXT_PUBLIC_KINDE_DOMAIN

# Set environment variables for the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_KINDE_API_CLIENT=$NEXT_PUBLIC_KINDE_API_CLIENT
ENV NEXT_PUBLIC_KINDE_DOMAIN=$NEXT_PUBLIC_KINDE_DOMAIN

# Build the project
RUN cd apps/inventar-next && pnpm run build

# Production stage - using Node.js for Next.js standalone
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build
COPY --from=builder /app/apps/inventar-next/.next/standalone ./
COPY --from=builder /app/apps/inventar-next/.next/static ./apps/inventar-next/.next/static
COPY --from=builder /app/apps/inventar-next/public ./apps/inventar-next/public

# Set the correct permissions
USER nextjs

# Expose and run
EXPOSE 3000
CMD ["node", "apps/inventar-next/server.js"]