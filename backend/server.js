const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Allowed Origins for CORS (Local development + Deployed Vercel URLs)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://house-rent-jaydip18.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean); // removes any undefined values if process.env.CLIENT_URL is not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server, curl, Postman, or defined origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check / root route
app.get('/', (req, res) => {
  res.send('HouseRent API is running successfully');
});

// Primary API Routes with standard '/api' prefixes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Fallback aliases without '/api' (ensures endpoints like /auth/register work without 404s)
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Database connection & Server initialization
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`HouseRent API running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
} else {
  // Allow server to run even if Mongo URI is loaded separately
  app.listen(PORT, () => console.log(`HouseRent API running on port ${PORT}`));
}