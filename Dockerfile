# Stage 1: Build a Vite project using pnpm
FROM node:jod-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve with Nginx
FROM nginx:alpine
LABEL maintainer="Aung Myat Kyaw <aung.myat@globalmagicko.com>"

# Copy built assets from build stage
COPY --from=build /app/dist/ /usr/share/nginx/html

# Copy Nginx configuration and environment script
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod a+x /docker-entrypoint.d/env.sh
