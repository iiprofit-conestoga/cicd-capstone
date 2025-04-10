const express = require("express");
const { formatDate , getHandlerResponse , httpStatus   } = require("@adminsync/utils");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/adminsyncDB?authSource=adminsyncDB`;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Eror handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const response = getHandlerResponse(
    "error",
    httpStatus.INTERNAL_SERVER_ERROR,
    "Internal Server Error",
    process.env.NODE_ENV === 'development' ? { error: err.message } : null
  );
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log("Formated Date",formatDate(new Date()));
});