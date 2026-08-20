# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runner stage — serve static files with nginx ----
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config: serve static widget assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint: inject WIDGET_API_URL at container startup (no rebuild needed)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]