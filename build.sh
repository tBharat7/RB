#!/usr/bin/env bash
# Build script for Render

# Exit on error
set -o errexit

# Build the frontend
npm run build

echo "Build completed successfully!" 