const express = require("express");
const { formatDate, getHandlerResponse, httpStatus } = require("@adminsync/utils");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};

// Apply CORS middleware before other middleware
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  const response = getHandlerResponse(
    "success",
    httpStatus.OK,
    "Hello from Backend!",
    { timestamp: formatDate(new Date()) }
  );
 
  res.status(httpStatus.OK).json(response);
});

// Health check route
app.use('/api/health', healthRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  const response = getHandlerResponse(
    "error",
    httpStatus.NOT_FOUND,
    "Route not found",
    null
  );
  res.status(httpStatus.NOT_FOUND).json(response);
});

module.exports = app; 