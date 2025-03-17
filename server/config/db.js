import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// Global client reference that can be used throughout the application
let mongoClient = null;
let mongoDatabase = null;

const connectWithRetry = async (retries = 5, delay = 5000) => {
  // For development mode without MongoDB, simulate a successful connection
  if (process.env.NODE_ENV === 'development' && process.env.MOCK_DB === 'true') {
    console.log('Development mode with mock database - simulating successful connection');
    // Create a mock connection object to return
    return { connection: { host: 'mock-database' } };
  }
  
  let currentTry = 0;
  
  while (currentTry < retries) {
    try {
      console.log(`MongoDB connection attempt ${currentTry + 1} of ${retries}...`);
      
      // Check if URI is defined
      let mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        console.error('MongoDB URI is not defined in environment variables');
        throw new Error('MongoDB URI is undefined');
      }
      
      // Print sanitized URI for debugging
      const uriSanitized = mongoUri.includes('@') ? 
        `[...credentials hidden...]${mongoUri.split('@')[1]}` : 
        'mongodb://[hidden]';
      console.log(`Connecting to: ${uriSanitized}`);
      
      // Test DNS resolution before connecting (for Atlas)
      if (mongoUri.includes('mongodb+srv')) {
        const host = mongoUri.split('@')[1].split('/')[0];
        console.log(`Checking connection to MongoDB Atlas host: ${host}`);
      }
      
      // Connect using both Mongoose (for existing code) and direct MongoDB driver (new method)
      
      // 1. Connect with Mongoose
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        retryWrites: true,
        retryReads: true
      });
      
      // 2. Connect with MongoDB driver directly
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10
      });
      await client.connect();
      
      // Store client and database references globally
      mongoClient = client;
      mongoDatabase = client.db(); // Default database from connection string
      
      console.log(`MongoDB Connected with Mongoose: ${conn.connection.host}`);
      console.log(`MongoDB Connected with Driver: ${mongoDatabase.databaseName}`);
      
      // Set up connection event handlers for Mongoose
      mongoose.connection.on('error', err => {
        console.error('MongoDB Mongoose connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB Mongoose disconnected. Attempting to reconnect...');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB Mongoose reconnected');
      });
      
      return {
        mongoose: conn,
        client: mongoClient,
        db: mongoDatabase
      };
    } catch (error) {
      currentTry++;
      console.error(`MongoDB connection attempt ${currentTry} failed: ${error.message}`);
      console.error(error.stack);
      
      if (currentTry >= retries) {
        console.error('Maximum MongoDB connection retries reached');
        // Only use mock as last resort if enabled
        if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_FALLBACK === 'true') {
          console.log('Development mode - continuing without MongoDB connection');
          return { connection: { host: 'mock-database' } };
        } else {
          throw new Error('Failed to connect to MongoDB after multiple attempts');
        }
      }
      
      // Wait before trying again
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const connectDB = async () => {
  try {
    const connections = await connectWithRetry();
    return connections;
  } catch (error) {
    console.error('Fatal database connection error:', error);
    // Don't exit process in development to allow debugging
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
    return null;
  }
};

// Helper function to get the MongoDB client for direct operations
export const getMongoClient = () => mongoClient;

// Helper function to get the database instance
export const getDatabase = () => mongoDatabase;

export default connectDB; 