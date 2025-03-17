# Resume Builder Deployment Guide

This document provides instructions for deploying the Resume Builder application to various hosting platforms.

## Prerequisites

Before deploying, make sure you have:

1. A MongoDB Atlas account with a cluster set up
2. Your backend code ready for deployment
3. Your frontend code built and ready for deployment

## Backend Deployment (Server)

### Option 1: Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (or let Render assign one)
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your secret key

4. Deploy the service
5. Note down the deployment URL (e.g., `https://your-backend.onrender.com`)

### Option 2: Deploy to Heroku

1. Create a new app on Heroku
2. Connect your GitHub repository
3. Configure environment variables in the Settings tab
4. Deploy the application
5. Note down the deployment URL (e.g., `https://your-backend.herokuapp.com`)

## Frontend Deployment

### Option 1: Deploy to Netlify

1. Build your frontend: `npm run build`
2. Create a new site on Netlify
3. Deploy the `dist` folder
4. Configure environment variables if needed
5. Note down the deployment URL (e.g., `https://your-app.netlify.app`)

### Option 2: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from your project directory
3. Follow the prompts to deploy
4. Note down the deployment URL (e.g., `https://your-app.vercel.app`)

## Important Configuration Updates

After deployment, you need to update the following files:

### 1. Update API Base URL in `src/utils/api.ts`

Replace the placeholder URLs with your actual deployment URLs:

```javascript
// Netlify deployment (if using Netlify)
if (hostname.includes('netlify.app')) {
  return 'https://your-backend-url.onrender.com/api';
}

// Vercel deployment (if using Vercel)
if (hostname.includes('vercel.app')) {
  return 'https://your-backend-url.onrender.com/api';
}
```

### 2. Update CORS Configuration in `server/server.js`

Add your frontend domain to the allowed origins:

```javascript
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:3000',
  
  // Your actual frontend URLs
  'https://your-app.netlify.app',
  'https://your-app.vercel.app'
];
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is added to the allowed origins in the backend CORS configuration.

2. **405 Method Not Allowed**: Ensure that your API calls are using the correct HTTP methods (POST for authentication).

3. **Connection Failed**: Check that your MongoDB connection string is correct and that your IP is whitelisted in MongoDB Atlas.

4. **Authentication Errors**: Verify that your JWT secret is properly set in the environment variables.

## Monitoring and Logging

- Use the Render/Heroku dashboard to view server logs
- Consider adding more detailed logging in your application for better debugging

## Updating Your Deployment

1. Push changes to your GitHub repository
2. If you've configured automatic deployments, your app will update automatically
3. Otherwise, manually trigger a new deployment from the provider's dashboard 