# Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Production image
FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=frontend-build /app/frontend/dist ./dist/public
COPY backend/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/app.js"]
