FROM node:18.20.4-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package*.json ./
RUN npm ci

# ------------------------------------------------------------------------------
FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

# ------------------------------------------------------------------------------
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ------------------------------------------------------------------------------
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
FROM base as runner
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
