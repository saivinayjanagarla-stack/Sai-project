const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { getDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware to ensure DB is initialized
app.use(async (req, res, next) => {
  try {
    await getDB();
    next();
  } catch (err) {
    console.error('Database initialization error:', err);
    next(err);
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const emissionsRoutes = require('./routes/emissionsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const communityRoutes = require('./routes/communityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/emissions', emissionsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/community', communityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'EcoMetrics AI Backend API',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Google Gemini API Active' : 'Intelligent Heuristic Engine'
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoMetrics AI - Sustainability Platform API',
    version: '1.0.0',
    documentation: '/health'
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start local standalone server if run directly
if (require.main === module) {
  getDB().then(() => {
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 EcoMetrics AI Server running on port ${PORT}`);
      console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=================================================`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
  });
}

module.exports = app;
