import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { getMongoClient, getDatabase } from './config/db.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Testing MongoDB connection...');
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI ? '[REDACTED]' : 'undefined'
});

// Ensure MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.log('MongoDB URI not found in environment, using Atlas URI');
  process.env.MONGO_URI = 'mongodb+srv://btadaboinalm:iamgroot@cluster0.180jv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
}

async function testConnection() {
  try {
    // Connect to database
    const connection = await connectDB();
    console.log('Connection established:', connection ? 'Yes' : 'No');
    
    if (connection) {
      // Get MongoDB client and database
      const client = getMongoClient();
      const db = getDatabase();
      
      // Test database operations
      console.log('Connected to database:', db.databaseName);
      
      // List all collections
      const collections = await db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
      
      // Test a simple query (example: count users)
      const usersCount = await db.collection('users').countDocuments();
      console.log('Number of users:', usersCount);
      
      // Close connection
      await client.close();
      console.log('Connection closed successfully');
    }
  } catch (error) {
    console.error('MongoDB test failed:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

testConnection(); 