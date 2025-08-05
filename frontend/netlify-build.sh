#!/bin/bash
# Exit on error, but allow controlled error handling
set -e

echo "🚀 Starting Netlify build process..."

# Set Node.js version and display environment info
echo "📊 Environment Information:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PWD: $(pwd)"
echo "CI: $CI"
echo "NODE_ENV: $NODE_ENV"

# Clean any existing node_modules and lock files
echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json
rm -rf .npm

# Set npm configuration for legacy peer deps and CI environment
echo "⚙️ Configuring npm for CI environment..."
npm config set legacy-peer-deps true
npm config set audit false
npm config set fund false
npm config set update-notifier false

# Set CI-specific environment variables
export CI=true
export NODE_ENV=production
export DISABLE_ESLINT_PLUGIN=true
export GENERATE_SOURCEMAP=false
export SKIP_PREFLIGHT_CHECK=true

# Install dependencies with legacy peer deps (remove --force to avoid warnings)
echo "📦 Installing dependencies..."
if npm install --legacy-peer-deps --no-audit --no-fund; then
  echo "✅ Dependencies installed successfully"
else
  echo "❌ npm install failed, trying with --force..."
  npm install --legacy-peer-deps --force --no-audit --no-fund || {
    echo "❌ npm install failed completely"
    exit 2
  }
fi

# Check if build directory exists and remove it
if [ -d "build" ]; then
  echo "🗑️ Removing existing build directory..."
  rm -rf build
fi

# Build the application with error handling
echo "🏗️ Building the application..."
if npm run build:simple; then
  echo "✅ Build completed successfully!"
  
  # Verify build output
  if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "📁 Build verification passed - files exist"
    ls -la build/
  else
    echo "❌ Build verification failed - missing files"
    exit 1
  fi
else
  echo "❌ Build failed with exit code $?"
  echo "📝 Attempting to show more details..."
  npm run build:simple --verbose || true
  exit 1
fi
