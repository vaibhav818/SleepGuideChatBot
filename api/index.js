const app = require('../server/server');
const { connectDB } = require('../server/config/db');

// Serverless entrypoint for Vercel
module.exports = async (req, res) => {
  // Ensure DB connection is established for serverless invocation
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Serverless] DB connection warm-up warning:', err.message);
  }
  return app(req, res);
};

