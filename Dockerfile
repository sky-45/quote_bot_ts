# === STAGE 1: Build Environment ===
FROM node:20-alpine AS builder
WORKDIR /app

# Leverage caching for dependencies
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript to JavaScript
COPY . .
RUN npm run compile

# === STAGE 2: Production Environment ===
FROM node:20-alpine AS runner
WORKDIR /app

# Install timezone data (Kept from your original)
RUN apk add --no-cache tzdata
ENV TZ=America/Lima

# Copy package files to install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy ONLY the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the app port
EXPOSE 3000

# Cleansed CMD (Removed the deprecated specifier-resolution-node loader)
CMD ["node", "dist/index.js"]