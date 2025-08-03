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

// Import routes
const jobRoutes = require('../routes/jobRoutes');
const paystackRoutes = require('../routes/paystackRoutes');
const managerRoutes = require('../routes/managerRoutes');

// Main API route
app.get('/', (req, res) => {
  res.send('Welcome to AI Job Chommie Backend API');
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AI Job Chommie Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/jobs', jobRoutes);
app.use('/api/paystack', paystackRoutes);
app.use('/api/manager', managerRoutes);

// Set up server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
