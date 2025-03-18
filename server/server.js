import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config({ path: path.resolve('./server/.env') });

// Check for Koyeb environment
const isKoyebEnvironment = process.env.KOYEB_ENVIRONMENT === 'true' || !!process.env.KOYEB_PLATFORM;
if (isKoyebEnvironment) {
  console.log('Running in Koyeb environment');
  process.env.NODE_ENV = 'production';
}

// Log environment configuration
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? '[REDACTED]' : 'undefined',
  MOCK_DB: process.env.MOCK_DB,
  KOYEB: isKoyebEnvironment
});

// Ensure MongoDB URI is set - prefer Atlas over local
if (!process.env.MONGO_URI) {
  console.log('MongoDB URI not found in environment, using Atlas URI');
  process.env.MONGO_URI = 'mongodb+srv://btadaboinalm:iamgroot@cluster0.180jv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
}

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  // Don't crash the server on MongoDB connection failure
  // This allows the health checks to still pass
  console.log('Server will continue to run without database connectivity');
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration with support for Koyeb deployment
const corsOptions = {
  origin: function(origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      // Local development
      'http://localhost:5173',
      'http://localhost:3000',
      
      // Koyeb deployment domains
      'https://resume-builder-bharat.koyeb.app',
      'https://*.koyeb.app',

      // Other deployment URLs
      'https://resume-builder-bharat.netlify.app',
      'https://resume-builder-bharat.vercel.app',
      
      // GitHub Pages
      'https://tbharat7.github.io'
    ];
    
    // Allow requests with no origin (like mobile apps, curl requests, same-origin requests)
    if (!origin || origin === '') return callback(null, true);
    
    // In production, log all origins to debug CORS issues
    if (process.env.NODE_ENV === 'production') {
      console.log('Request origin:', origin);
    }
    
    // For production, check if origin matches a pattern
    if (process.env.NODE_ENV === 'production') {
      // Allow all Koyeb domains
      if (origin && (origin.includes('koyeb.app') || origin.includes('github.io'))) {
        return callback(null, true);
      }
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Add explicit OPTIONS handler for preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // Log all preflight requests in production for debugging
  if (process.env.NODE_ENV === 'production') {
    console.log('Preflight request from:', origin);
  }
  
  // Set CORS headers for preflight response
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});

// Health check endpoint - special routes for Koyeb health checks
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Explicit health check endpoints for Koyeb
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Add request logging in production for debugging
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Serve static assets if in production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - serving static assets from dist folder');
  
  // Log the dist directory structure for debugging
  try {
    const fs = require('fs');
    const distPath = path.join(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      console.log('Dist folder exists, contents:', fs.readdirSync(distPath));
    } else {
      console.log('Dist folder does not exist at:', distPath);
    }
  } catch (err) {
    console.error('Error checking dist folder:', err);
  }
  
  // Set static folder
  app.use(express.static(path.join(rootDir, 'dist')));

  // Any route that is not an API route or health check serves the index.html
  app.get('*', (req, res, next) => {
    // Skip API routes and health endpoints
    if (req.path.startsWith('/api') || 
        req.path === '/health' || 
        req.path === '/healthz' ||
        req.path === '/') {
      return next();
    }
    // Send the index.html file
    const indexPath = path.resolve(rootDir, 'dist', 'index.html');
    console.log('Attempting to serve index.html from:', indexPath);
    res.sendFile(indexPath, err => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Error loading application. Please try again later.');
      }
    });
  });
} else {
  console.log('Running in development mode - API only');
  // Root route is already handled by health check above
}

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Define port for Koyeb compatibility
// Koyeb expects the app to listen on port 8000 for health checks
const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 