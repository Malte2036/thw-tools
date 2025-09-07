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

ARG PUBLIC_API_URL
ARG PUBLIC_KINDE_API_CLIENT
ARG PUBLIC_KINDE_DOMAIN

# Set environment variables for the build
ENV NEXT_PUBLIC_API_URL=$PUBLIC_API_URL
ENV NEXT_PUBLIC_KINDE_API_CLIENT=$PUBLIC_KINDE_API_CLIENT
ENV NEXT_PUBLIC_KINDE_DOMAIN=$PUBLIC_KINDE_DOMAIN

# Build the project
RUN cd apps/inventar-next && pnpm run build

# Production stage - using nginx for static files
FROM nginx:stable-alpine
WORKDIR /app

# Copy the built static files
COPY --from=builder /app/apps/inventar-next/out /usr/share/nginx/html

# Expose and run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]