const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const chatRoutes = require('./routes/chatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// 1. Security Headers (Helmet with relaxed CSP for SPA assets)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. HTTP Request Compression (Improves backend response payload speeds by ~35%)
app.use(compression());

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl) or matched origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
  })
);

// 4. Request Logging (Morgan)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 5. Body Parsers with payload limits
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// 6. Global API Rate Limiter (Protects against DDoS / brute-force)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api/', apiLimiter);

// 7. Dedicated Rate Limiter for AI Chatbot (Prevents Gemini API quota exhaustion)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 prompts per minute
  message: {
    success: false,
    message: 'Chat prompt frequency exceeded. Please pause a moment before asking another question.',
  },
});
app.use('/api/chat/', chatLimiter);

// 8. Health check & System Status route
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SomnaAI Sleep Guidance Platform API',
    version: '1.0.0',
    database: dbStatus,
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

// 9. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// 10. Serve Frontend Single Page Application (SPA)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  // Catch-all route to serve React index.html for client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #080a18; color: #fff; min-height: 100vh;">
        <h1 style="color: #6366f1;">🌙 SomnaAI Backend API is Running</h1>
        <p style="color: #94a3b8;">Frontend development server is available at <a href="http://localhost:5173" style="color: #38bdf8;">http://localhost:5173</a></p>
        <p style="color: #94a3b8;">API Health endpoint: <a href="/api/health" style="color: #10b981;">/api/health</a></p>
      </div>
    `);
  });
}

// 11. Centralized Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🌙 SomnaAI Sleep Guidance API running on PORT: ${PORT}`);
  console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'API Key Detected' : 'Smart Contextual Fallback Active'}`);
  console.log(`======================================================\n`);
});

// Handle unhandled exceptions & promise rejections
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception Caught]:', err.stack || err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection Caught]:', err.stack || err.message);
});

module.exports = app;
