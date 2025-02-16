FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN npx prisma generate
RUN pnpm run build
RUN pnpm prune --prod

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

EXPOSE ${PORT}
CMD ["node", "dist/main"]