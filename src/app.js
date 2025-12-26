const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
const pageRoutes = require("./routes/pageRoutes");
app.use("/", pageRoutes);

module.exports = app;
