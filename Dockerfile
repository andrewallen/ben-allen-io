# syntax=docker/dockerfile:1

# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install OS deps (optional but helpful for some packages)
RUN apk add --no-cache libc6-compat

# Copy package manifests first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies deterministically and audit
RUN npm ci --omit=dev && npm audit --production || true

# Copy the rest of the project
COPY . .

# Build the site (syncs cv.md → src/pages/cv.md before build)
RUN npm run build

# --- Runtime Stage (Nginx) ---
FROM nginx:1.27-alpine AS runner

# Create non-root user
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot \
    && mkdir -p /etc/nginx/conf.d /usr/share/nginx/html \
    && chown -R nonroot:nonroot /var/cache/nginx /var/run /etc/nginx /usr/share/nginx/html

# Nginx configuration
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static site
COPY --from=builder /app/dist /usr/share/nginx/html

USER nonroot

EXPOSE 8080
# Use IPv4 loopback explicitly to avoid potential IPv6 localhost (::1) resolution issues
# with BusyBox wget in Alpine-based images.
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
