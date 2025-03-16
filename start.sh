#!/usr/bin/env bash
# Start script for Render

# Print environment info (without sensitive data)
echo "Starting server in $NODE_ENV mode..."
echo "Server port: $PORT"

# Run the server
node server/server.js 