import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Route imports (ensure the .js extension is included for ES modules)
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Allowed Origins for CORS (Local development + Deployed Vercel URLs)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://house-rent-jaydip18.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
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

// Fallback aliases without '/api'
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
  app.listen(PORT, () => console.log(`HouseRent API running on port ${PORT}`));
}