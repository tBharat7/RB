import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkMongoDB() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the .env file');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check users collection
    if (collections.some(col => col.name === 'users')) {
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      console.log('\nUsers in the database:', users.length);
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Created: ${user.createdAt}`);
      });
    } else {
      console.log('\nNo users collection found.');
    }

    // Check resumes collection
    if (collections.some(col => col.name === 'resumes')) {
      const resumes = await mongoose.connection.db.collection('resumes').find({}).toArray();
      console.log('\nResumes in the database:', resumes.length);
      resumes.forEach((resume, index) => {
        console.log(`\nResume ${index + 1}:`);
        console.log(`  User ID: ${resume.user}`);
        console.log(`  Last saved: ${resume.lastSaved}`);
      });
    } else {
      console.log('\nNo resumes collection found.');
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkMongoDB(); 