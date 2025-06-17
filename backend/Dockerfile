# ---- Build Stage ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # Copy source files
    COPY tsconfig.json ./
    COPY src ./src
    
    # Build the app
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Only copy production dependencies
    COPY package.json package-lock.json ./
    RUN npm ci --omit=dev
    
    # Copy built files from builder
    COPY --from=builder /app/dist ./dist
    
    # If you need to copy other files (like config), add here
    
    # Set environment variables if needed
    ENV NODE_ENV=production
    
    # Expose the port your app runs on (change if not 3000)
    EXPOSE 3000
    
    # Start the app (adjust if your entry point is different)
    CMD ["node", "dist/app.js"]