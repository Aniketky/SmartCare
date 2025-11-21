const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const chatRoutes = require('./routes/chat');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const uploadRoutes = require('./routes/upload');
const oximeterRoutes = require('./routes/oximeter');
const temperatureRoutes = require('./routes/temperature');

// Security middleware
app.use(helmet());

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs (increased for testing)
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded medical reports
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/oximeter', oximeterRoutes);
app.use('/api/temperature', temperatureRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SmartCare API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database
const { initializeDatabase } = require('./database/init');
initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 SmartCare server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 