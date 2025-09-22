#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Set environment variables for build
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Payload types (ignore errors)
echo "🔧 Generating Payload types..."
pnpm payload generate:types || echo "⚠️ Type generation failed, continuing..."

# Build the application
echo "🏗️ Building application..."
pnpm run build

echo "✅ Build completed!"
