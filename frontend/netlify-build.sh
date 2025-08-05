#!/bin/bash
set -e

echo "Starting Netlify build process..."

# Set Node.js version
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Clean any existing node_modules and lock files
echo "Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json

# Set npm configuration for legacy peer deps
echo "Configuring npm for legacy peer dependencies..."
npm config set legacy-peer-deps true
npm config set force true
npm config set audit false

# Install dependencies with force flags
echo "Installing dependencies with --legacy-peer-deps and --force..."
npm install --legacy-peer-deps --force

# Build the application
echo "Building the application..."
NODE_ENV=production npm run build:simple

echo "Build completed successfully!"
