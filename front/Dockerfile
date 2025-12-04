# Multi-stage Dockerfile for Angular app
# Build stage: use full Node image for reliable Angular builds
FROM node:18-bullseye-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build production bundle
COPY . .
RUN npm run build -- --configuration production

# Production stage: serve with nginx
FROM nginx:stable-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist/projet-restau /usr/share/nginx/html

EXPOSE 80

CMD ["sleep 20 && nginx", "-g", "daemon off;"]
