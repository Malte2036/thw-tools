FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache curl && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:inventar

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/inventar build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]

