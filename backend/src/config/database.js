import mongoose from 'mongoose';
import { createAllIndexes } from './indexes.js';

// MongoDB Connection Options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connection event handlers
const onConnected = () => {
  console.log('MongoDB reconnected');
};

const onDisconnected = () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
};

const onError = (err) => {
  console.error('MongoDB connection error:', err);
};

// Connect to MongoDB - reads MONGO_URI at call time (after dotenv loads)
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    const conn = await mongoose.connect(uri, mongoOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', onError);
    mongoose.connection.on('disconnected', onDisconnected);
    mongoose.connection.on('reconnected', onConnected);

    // Create database indexes for optimized queries
    await createAllIndexes();

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Graceful shutdown helper
const disconnectDB = async () => {
  await mongoose.connection.close();
};

// Check database connection status
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get connection info
const getConnectionInfo = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

export { connectDB, disconnectDB, isConnected, getConnectionInfo, mongoConfig };
export default connectDB;