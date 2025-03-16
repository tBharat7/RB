#!/usr/bin/env bash
# Build script for Render

# Exit on error
set -o errexit

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building the application..."
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Use npx to run vite directly
npx vite build

echo "Build completed successfully!" 