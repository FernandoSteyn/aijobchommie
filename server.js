require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Basic routes that will always work
app.get('/', (req, res) => {
  res.json({
    message: 'AI Job Chommie Backend API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AI Job Chommie Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint working perfectly!',
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasPaystackKeys: !!(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY),
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });
});

// Try to load advanced routes if available
try {
  console.log('🔍 Attempting to load backend routes...');
  
  // Try different possible paths for the backend routes
  const possibleBackendPaths = [
    './backend/routes',
    './backend',
    path.join(__dirname, 'backend', 'routes'),
    path.join(__dirname, 'backend')
  ];
  
  let backendFound = false;
  
  for (const backendPath of possibleBackendPaths) {
    try {
      const jobRoutesPath = path.join(backendPath, 'routes/jobRoutes.js');
      const paystackRoutesPath = path.join(backendPath, 'routes/paystackRoutes.js');
      const managerRoutesPath = path.join(backendPath, 'routes/managerRoutes.js');
      
      // Check if files exist
      const fs = require('fs');
      if (fs.existsSync(jobRoutesPath)) {
        const jobRoutes = require(jobRoutesPath);
        app.use('/api/jobs', jobRoutes);
        console.log('✅ Job routes loaded from:', jobRoutesPath);
        backendFound = true;
      }
      
      if (fs.existsSync(paystackRoutesPath)) {
        const paystackRoutes = require(paystackRoutesPath);
        app.use('/api/paystack', paystackRoutes);
        console.log('✅ Paystack routes loaded from:', paystackRoutesPath);
        backendFound = true;
      }
      
      if (fs.existsSync(managerRoutesPath)) {
        const managerRoutes = require(managerRoutesPath);
        app.use('/api/manager', managerRoutes);
        console.log('✅ Manager routes loaded from:', managerRoutesPath);
        backendFound = true;
      }
      
      if (backendFound) break;
      
    } catch (error) {
      console.log(`⚠️  Could not load routes from ${backendPath}:`, error.message);
      continue;
    }
  }
  
  if (!backendFound) {
    console.log('⚠️  Backend routes not found, running with basic endpoints only');
  }
  
} catch (error) {
  console.log('⚠️  Running in basic mode without advanced routes:', error.message);
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
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/test'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://${HOST}:${PORT}/api/test`);
  console.log(`📁 Working directory: ${process.cwd()}`);
});
