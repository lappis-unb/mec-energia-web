FROM node:18.20.4-alpine AS base

RUN apk add --no-cache libc6-compat

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# -----------------------------------------------------------------------------
# Stage deps: Install dependencies to cache them

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=${NODE_ENV}

# -----------------------------------------------------------------------------
# Stage dev: Used only in develop with fast refresh source code and debugging

FROM base AS dev

RUN apk add --no-cache bash curl wget git vim
WORKDIR /app

RUN chown -R node:node /app
USER node

CMD [tail -f /dev/null]

# -----------------------------------------------------------------------------
# Stage builder: Build the app based on clean dependencies and source code

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

RUN npm run build

# -----------------------------------------------------------------------------
# Stage runner: Create optimized image with standalone files and run the app

FROM base as runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
