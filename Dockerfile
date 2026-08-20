# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for cache
COPY package*.json ./

# Install ALL deps (including devDeps needed for the build)
RUN npm ci

# Copy source
COPY . .

# Build-time env: widget API base URL.
# Pass with: docker build --build-arg VITE_WIDGET_API=https://api.example.com .
# Defaults to a placeholder so the build never fails on missing arg.
ARG VITE_WIDGET_API
ENV VITE_WIDGET_API=${VITE_WIDGET_API}

# Build the widget bundle (tsc -b && vite build) → output in dist/
RUN npm run build

# ---- Runner stage — serve static files with nginx ----
FROM nginx:alpine

# Copy built assets into nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config: serve static widget assets (bundle + icons)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]