const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

/**
 * Connect to MongoDB with retry logic and event listeners
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eduplatform';

  // Event handlers
  mongoose.connection.on('connected', () => {
    console.log(`[Database] MongoDB connected successfully to: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[Database] MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB disconnected. Attempting reconnection...');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('[Database] MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('[Database] Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        autoIndex: process.env.NODE_ENV !== 'production'
      });

      console.log(`[Database] MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      retries += 1;
      console.error(`[Database] Connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`);

      if (retries >= MAX_RETRIES) {
        console.error('[Database] Could not connect to MongoDB after maximum retries. Exiting process.');
        process.exit(1);
      }

      console.log(`[Database] Retrying in ${RETRY_INTERVAL / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
};

module.exports = connectDB;
