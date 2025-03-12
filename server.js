import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import contactRoutes from "./api/contactAPI.js";
import signupRoutes from "./api/signupAPI.js";
import loginRoutes from "./api/loginAPI.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS and parse JSON data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files (if you have product images or files)
app.use("/uploads", express.static("uploads"));

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/myAppDB";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);

// Add Products API route

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
