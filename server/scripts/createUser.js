import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { getMongoClient, getDatabase } from '../config/db.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('User management utility');
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI ? '[REDACTED]' : 'undefined'
});

// Ensure MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.log('MongoDB URI not found in environment, using Atlas URI');
  process.env.MONGO_URI = 'mongodb+srv://btadaboinalm:iamgroot@cluster0.180jv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
}

async function showUsers() {
  try {
    // Connect to database
    await connectDB();
    
    const db = getDatabase();
    
    // List all users - fix projection issue
    const users = await db.collection('users').find({}).project({
      password: 0 // Exclude password only
    }).toArray();
    
    console.log('\nCurrent users:');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username || 'N/A'} (${user.email || 'N/A'})`);
      });
    }
    
    // Close connection
    const client = getMongoClient();
    await client.close();
    
    return users;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function createUser(userData) {
  try {
    // Connect to database
    await connectDB();
    
    const db = getDatabase();
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });
    
    if (existingUser) {
      console.log(`User already exists: ${existingUser.username} (${existingUser.email})`);
      return existingUser;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user
    const result = await db.collection('users').insertOne({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      displayName: userData.displayName || userData.username,
      photoURL: userData.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`User created: ${userData.username} (${userData.email})`);
    
    // Close connection
    const client = getMongoClient();
    await client.close();
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create a test user
async function createTestUser() {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User'
  };
  
  await createUser(testUser);
}

// Run the functions
async function main() {
  // Show existing users
  await showUsers();
  
  // Create a test user - uncomment this line to create
  await createTestUser();
  
  // Show users again after creating
  await showUsers();
  
  process.exit(0);
}

main(); 