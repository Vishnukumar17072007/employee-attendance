const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ REQUIRED FOR AUTH

// Static files
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/", pageRoutes);

module.exports = app;
