const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/devops.devops', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Request logging
app.use(rateLimiter); // Rate limiting

// Add this line to serve static files
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist' });
});

// Error handler
app.use(errorHandler);

module.exports = app;