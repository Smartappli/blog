# syntax=docker/dockerfile:1
# NOTE: This Dockerfile is for staging/production image only

# ------------------
# Stage 1: Install dependencies
# ------------------
# Using latest Nodejs LTS image
FROM node:22-bookworm-slim AS deps

LABEL org.opencontainers.image.authors="Amine.Roukh@umons.ac.be"

# Accept build arg for NPM auth
ARG NPM_TOKEN

# Set working directory
WORKDIR /usr/src/service

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifest files
COPY package.json pnpm-lock.yaml* ./

# Add private npm token for GitLab registry
RUN echo "//gitlab.awenet.be/api/v4/projects/84/packages/npm/:_authToken=${NPM_TOKEN}" > .npmrc

# Install dependencies
RUN pnpm install --frozen-lockfile

# ------------------
# Stage 2: Build final image
# ------------------
FROM node:22-bookworm-slim AS runner

# Create app directory
WORKDIR /usr/src/service

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies from previous stage
COPY --from=deps /usr/src/service/node_modules ./node_modules
COPY --from=deps /usr/src/service/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /usr/src/service/package.json ./package.json
COPY --from=deps /usr/src/service/.npmrc ./.npmrc

# Copy all application files
COPY  . .

# Remove dev dependencies for production
RUN CI=true pnpm prune --prod

# ------------------
# Final image
# ------------------
FROM node:22-bookworm-slim AS web

# Optimizations for production environment
ENV NODE_ENV=production

# Properly handle events to safely terminate a Node.js application
RUN apt update && apt install -y \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/service

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=runner --chown=node:node /usr/src/service ./

EXPOSE 5000

# Do not use root to run the app
USER node

# Runs as PID 1, acting like a simple init system
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run the command on container startup
CMD ["pnpm", "start"]
