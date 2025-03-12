FROM node:18-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml .
RUN apk add --no-cache curl && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]