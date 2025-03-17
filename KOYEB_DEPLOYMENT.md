# Koyeb Deployment Guide for Resume Builder

This guide will help you resolve the 405 Method Not Allowed error and properly configure your Resume Builder application for Koyeb deployment.

## Problem: 405 Method Not Allowed Error

When deploying to Koyeb, you're encountering a 405 (Method Not Allowed) error when trying to authenticate. This is likely because:

1. The frontend is not correctly reaching the backend API
2. The CORS configuration is not properly set up
3. The Koyeb deployment may be prioritizing the frontend over the backend server

## Solution Steps

### 1. Update package.json

Ensure that your `package.json` has the correct scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "server": "node server/server.js",
  "start": "node server/server.js"
}
```

This makes sure that Koyeb runs your backend server when it uses the `npm start` command.

### 2. Configure API URLs

Update your `src/utils/api.ts` file to properly handle Koyeb domains:

```javascript
// API base URL configuration for different environments
const API_BASE_URL = (() => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Koyeb deployment
  if (hostname.includes('koyeb.app')) {
    // If frontend and backend are deployed together (same domain)
    return '/api';
  }
  
  // Custom domain or other deployment platforms
  return '/api';
})();
```

### 3. Update CORS Configuration

In `server/server.js`, update your CORS configuration:

```javascript
// CORS configuration with support for Koyeb deployment
const corsOptions = {
  origin: function(origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      // Local development
      'http://localhost:5173',
      'http://localhost:3000',
      
      // Add your actual Koyeb app URL
      'https://your-app-name.koyeb.app'
    ];
    
    // Allow requests with no origin (like same-origin requests)
    if (!origin || origin === '') return callback(null, true);
    
    // Log origins in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.log('Request origin:', origin);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 4. Create a Procfile

Create a `Procfile` in the root of your project:

```
web: node server/server.js
```

This tells Koyeb to run your Node.js server as the main process.

### 5. Configure Koyeb Environment Variables

Make sure to set these environment variables in the Koyeb dashboard:

- `NODE_ENV`: `production`
- `PORT`: `8080` (Koyeb's default port)
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your secret key for JWT authentication

### 6. Deploy as a Single Service (Backend Only)

Since Koyeb can run either your frontend or backend (but has issues running both together), consider:

1. Deploying only the backend server to Koyeb
2. Deploying the frontend to a static hosting service like Netlify or Vercel
3. Configuring the frontend to point to your Koyeb backend API

## Diagnosing Deployment Issues

If you continue to experience issues:

1. **Enable Debug Logging**: Add more console logs to your server:
   
   ```javascript
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.path}`);
     next();
   });
   ```

2. **Check Koyeb Logs**: View the logs in the Koyeb dashboard to see any errors

3. **Test API Endpoints**: Use a tool like Postman to test your API endpoints directly

## Full Application vs. Split Deployment

### Option 1: Full-Stack on Koyeb (Simpler)

If you want to keep everything on Koyeb, modify your `server.js` to serve the built frontend:

```javascript
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('Serving frontend from /dist folder');
  app.use(express.static(path.join(rootDir, 'dist')));
  
  // Any non-API route serves the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'dist', 'index.html'));
  });
}
```

### Option 2: Split Deployment (More Reliable)

Deploy your backend to Koyeb and frontend to Netlify or Vercel:

1. Backend on Koyeb: Focus on just the API server
2. Frontend on Netlify/Vercel: Point to your Koyeb backend URL
3. Update CORS settings to allow requests from your frontend domain 