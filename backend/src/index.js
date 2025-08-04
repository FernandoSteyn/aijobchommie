require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

// Initialize Express app
const app = express();

// Common middlewares
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Main API route
app.get('/', (req, res) => {
  res.send('Welcome to AI Job Chommie Backend API');
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AI Job Chommie Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint to check environment variables
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint working',
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV
  });
});

// Import and use routes with error handling
try {
  const path = require('path');
  
  // Try to load routes one by one to identify which one is causing issues
  try {
    const jobRoutes = require(path.join(__dirname, '../routes/jobRoutes'));
    app.use('/api/jobs', jobRoutes);
    console.log('✅ Job routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading job routes:', error.message);
  }
  
  try {
    const paystackRoutes = require(path.join(__dirname, '../routes/paystackRoutes'));
    app.use('/api/paystack', paystackRoutes);
    console.log('✅ Paystack routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading paystack routes:', error.message);
  }
  
  try {
    const managerRoutes = require(path.join(__dirname, '../routes/managerRoutes'));
    app.use('/api/manager', managerRoutes);
    console.log('✅ Manager routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading manager routes:', error.message);
  }
  
} catch (error) {
  console.error('❌ Error setting up routes:', error.message);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Set up server
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Always bind to 0.0.0.0 for Render deployment

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
  console.log(`📊 Health check available at: http://${HOST}:${PORT}/api/health`);
  console.log(`🧪 Test endpoint available at: http://${HOST}:${PORT}/api/test`);
});
