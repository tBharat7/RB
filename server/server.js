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

// Only use mock database if explicitly set in .env
// Remove automatic enabling of mock mode
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? '[REDACTED]' : 'undefined',
  MOCK_DB: process.env.MOCK_DB
});

// Ensure MongoDB URI is set - prefer Atlas over local
if (!process.env.MONGO_URI) {
  console.log('MongoDB URI not found in environment, using Atlas URI');
  process.env.MONGO_URI = 'mongodb+srv://btadaboinalm:iamgroot@cluster0.180jv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration with support for Koyeb deployment
const corsOptions = {
  origin: function(origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      // Local development
      'http://localhost:5173',
      'http://localhost:3000',
      
      // Koyeb deployment domains
      'https://your-app-name.koyeb.app',

      // Other deployment URLs
      'https://your-frontend.netlify.app',
      'https://your-frontend.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps, curl requests, same-origin requests)
    if (!origin || origin === '') return callback(null, true);
    
    // In production, log all origins to debug CORS issues
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

app.use(cors(corsOptions));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Serve static assets if in production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - serving static assets from dist folder');
  // Set static folder
  app.use(express.static(path.join(rootDir, 'dist')));

  // Any route that is not an API route serves the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'dist', 'index.html'));
  });
} else {
  console.log('Running in development mode - API only');
  app.get('/', (req, res) => {
    res.send('Resume Builder API is running. Frontend should be served separately in development.');
  });
}

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Define port and override from env if needed
const PORT = 5000; // Using port 5000 as requested

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 