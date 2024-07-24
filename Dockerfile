FROM node:18.20.4-alpine AS base

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=${NODE_ENV}

# ------------------------------------------------------------------------------
# Hot-reload the source code in development
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

RUN npm run build

# ------------------------------------------------------------------------------
# Output traces to reduce image size
FROM base as runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
