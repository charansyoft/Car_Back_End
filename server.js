import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import contactRoutes from "./api/contactAPI.js";
import productsRoutes from "./api/ProductsApi.js";
import bookingsRoutes from "./api/BookingsApi.js";
import authRoutes from "./api/authRoutes.js"
dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS and parse JSON data
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ✅ Allow frontend requests with credentials
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ To handle authentication tokens

// Serve uploaded files (for product images)
app.use("/uploads", express.static("uploads"));

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/myAppDB";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/auth", authRoutes); // ✅ Add authentication routes

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));