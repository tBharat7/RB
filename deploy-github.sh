#!/bin/bash

# Resume Builder GitHub Pages Deployment Script
# This script builds and prepares the frontend for GitHub Pages deployment

# Exit on error
set -e

echo "===== Resume Builder GitHub Pages Deployment Script ====="
echo "Building application for GitHub Pages deployment..."

# Ensure we're in the project root directory
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

# Install dependencies if needed
if [ "$1" == "--install" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Set the correct base URL for GitHub Pages in vite.config.js if needed
if grep -q "base: '/'" vite.config.js; then
  echo "Setting base URL for GitHub Pages in vite.config.js..."
  sed -i '' 's|base: \x27/\x27|base: \x27/resume-builder/\x27|g' vite.config.js
  echo "Base URL updated in vite.config.js"
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

# Create GitHub Pages deployment directory if it doesn't exist
DEPLOY_DIR="$PROJECT_ROOT/gh-pages"
mkdir -p "$DEPLOY_DIR"

# Copy the build files to the deployment directory
echo "Preparing GitHub Pages deployment package..."
cp -r dist/* "$DEPLOY_DIR/"

# Create a simple .nojekyll file to prevent GitHub from processing the site with Jekyll
touch "$DEPLOY_DIR/.nojekyll"

# Create a 404.html that redirects to index.html for SPA routing
cat > "$DEPLOY_DIR/404.html" << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  Redirecting...
</body>
</html>
EOL

# Add a script to index.html to handle redirects for SPA routing
if [ -f "$DEPLOY_DIR/index.html" ]; then
  echo "Adding SPA routing script to index.html..."
  
  # Insert the SPA redirect script before the closing head tag
  SPA_SCRIPT='
  <!-- Start Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === "/") {
        var decoded = l.search.slice(1).split("&").map(function(s) { 
          return s.replace(/~and~/g, "&")
        }).join("?");
        window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
  <!-- End Single Page Apps for GitHub Pages -->'
  
  sed -i '' "s|</head>|$SPA_SCRIPT\n</head>|" "$DEPLOY_DIR/index.html"
fi

echo "GitHub Pages deployment package created at $DEPLOY_DIR"
echo ""

# Instructions for deploying to GitHub Pages
echo "===== GitHub Pages Deployment Instructions ====="
echo "1. Create a GitHub repository for your project if you haven't already."
echo ""
echo "2. Push your deployment package to the 'gh-pages' branch:"
echo "   cd $DEPLOY_DIR"
echo "   git init"
echo "   git add -A"
echo "   git commit -m 'Deploy to GitHub Pages'"
echo "   git push -f https://github.com/tbharat7/resume-builder.git main:gh-pages"
echo ""
echo "3. Configure your repository settings:"
echo "   - Go to your repository on GitHub"
echo "   - Navigate to Settings > Pages"
echo "   - Select 'Deploy from a branch' as the source"
echo "   - Choose the 'gh-pages' branch and the '/ (root)' folder"
echo "   - Click Save"
echo ""
echo "4. Your site will be published at: https://tbharat7.github.io/resume-builder/"
echo ""
echo "Deployment package is ready!"

# Make this script executable with: chmod +x deploy-github.sh
# Run with: ./deploy-github.sh 