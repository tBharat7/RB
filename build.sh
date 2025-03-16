#!/usr/bin/env bash
# Build script for Render

# Exit on error
set -o errexit

# Install dependencies
echo "Installing dependencies..."
npm install

# Clean any previous builds
echo "Cleaning previous build..."
rm -rf dist

# Build the frontend
echo "Building the application..."
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Use npx to run vite directly with explicit base path
npx vite build --base=./

echo "Build completed successfully!" 