#!/usr/bin/env bash
# Build script for Render

# Exit on error
set -o errexit

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building the application..."
npm run build

echo "Build completed successfully!" 