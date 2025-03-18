#!/bin/bash

# Resume Builder Koyeb Deployment Script
# This script builds the frontend and prepares the application for Koyeb deployment

# Exit on error
set -e

echo "===== Resume Builder Deployment Script ====="
echo "Building application for Koyeb deployment..."

# Ensure we're in the project root directory
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

# Install dependencies if needed
if [ "$1" == "--install" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the frontend
echo "Building React frontend..."
npm run build

# Check if build was successful
if [ -d "./dist" ]; then
  echo "Frontend build successful!"
else
  echo "Frontend build failed. Check for errors above."
  exit 1
fi

# Create Koyeb deployment directory if it doesn't exist
DEPLOY_DIR="$PROJECT_ROOT/koyeb-deploy"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files for deployment
echo "Preparing deployment package..."
cp -r dist "$DEPLOY_DIR/"
cp -r server "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp koyeb.yaml "$DEPLOY_DIR/"

# Create a simplified package.json for deployment
cat > "$DEPLOY_DIR/package.json" << EOL
{
  "name": "resume-builder",
  "version": "1.0.0",
  "type": "module",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOL

# Create a Procfile for Koyeb
cat > "$DEPLOY_DIR/Procfile" << EOL
web: npm start
EOL

echo "Deployment package created at $DEPLOY_DIR"
echo ""

# Instructions for deploying to Koyeb
echo "===== Deployment Instructions ====="
echo "1. Install Koyeb CLI if not already installed:"
echo "   brew install koyeb/tap/cli"
echo ""
echo "2. Log in to Koyeb:"
echo "   koyeb login"
echo ""
echo "3. Deploy to Koyeb:"
echo "   cd $DEPLOY_DIR"
echo "   koyeb app init resume-builder --git github.com/YOUR_USERNAME/resume-builder --git-branch main --ports 5000:http --routes /:5000"
echo ""
echo "Or use the Koyeb web interface to deploy from GitHub."
echo ""
echo "4. Set up environment variables in Koyeb dashboard:"
echo "   - MONGO_URI: [your MongoDB connection string]"
echo "   - JWT_SECRET: [your JWT secret]"
echo "   - NODE_ENV: production"
echo "   - PORT: 5000"
echo "   - KOYEB_ENVIRONMENT: true"
echo ""
echo "Deployment package is ready!"

# Make this script executable with: chmod +x deploy.sh
# Run with: ./deploy.sh 