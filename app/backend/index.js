const express = require("express");
const { formatDate } = require("@adminsync/utils");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();


// MongoDB Connection
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/adminsyncDB?authSource=adminsyncDB`;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Formated Date",formatDate(new Date()));
});