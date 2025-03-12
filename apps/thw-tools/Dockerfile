FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@latest

# Set up the monorepo structure
WORKDIR /app
# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy tsconfig base
COPY tsconfig.base.json ./
# Copy the web-components package
COPY packages/web-components ./packages/web-components/
# Copy the thw-tools app
COPY apps/thw-tools ./apps/thw-tools/

# Install dependencies for the entire monorepo
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the web-components package first
FROM deps AS build-web-components
WORKDIR /app/packages/web-components
RUN pnpm build

# Build the thw-tools app
FROM build-web-components AS build-app
WORKDIR /app/apps/thw-tools
RUN pnpm build

# Production image
FROM node:20-slim AS production
WORKDIR /app

# Copy only the built app and its dependencies
COPY --from=build-app /app/apps/thw-tools/build ./build
COPY --from=build-app /app/apps/thw-tools/package.json ./

# Install only production dependencies
RUN npm install -g pnpm@latest
RUN pnpm install --prod --ignore-scripts

EXPOSE 8000
ENV NODE_ENV=production
CMD ["node", "build"]