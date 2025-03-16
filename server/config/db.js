import mongoose from 'mongoose';

const connectWithRetry = async (retries = 5, delay = 5000) => {
  let currentTry = 0;
  
  while (currentTry < retries) {
    try {
      console.log(`MongoDB connection attempt ${currentTry + 1} of ${retries}...`);
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // Increased from 5000
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000, // Added connection timeout
        retryWrites: true,
        retryReads: true
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Set up connection error handlers for resilience
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
        // Don't exit process, allow the connection to recover
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
      });
      
      return true;
    } catch (error) {
      currentTry++;
      console.error(`MongoDB connection attempt ${currentTry} failed: ${error.message}`);
      
      if (currentTry >= retries) {
        console.error('Maximum MongoDB connection retries reached');
        process.exit(1);
      }
      
      // Wait before trying again
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const connectDB = async () => {
  await connectWithRetry();
};

export default connectDB; 