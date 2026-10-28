const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sleepguide';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to detect if MongoDB is available
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB Fallback] Running in hybrid memory-backed mode so all endpoints, auth, sleep logs, and chat continue functioning without interruption!`);
    console.warn(`[MongoDB Setup Tip] To connect to a live database, install MongoDB locally or paste your MongoDB Atlas connection string into server/.env.`);
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : 'In-Memory Fallback',
  host: isConnected ? mongoose.connection.host : 'local-memory',
});

module.exports = { connectDB, getDBStatus };

