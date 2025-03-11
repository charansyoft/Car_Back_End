import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import contactRoutes from "./api/contactAPI.js"; // Import Contact API
import signupRoutes from "./api/signupAPI.js"; // Import Signup API
import loginRoutes from "./api/loginAPI.js"; // Import Login API

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/myAppDB";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// Use Modular APIs
app.use("/api", contactRoutes);
app.use("/api", signupRoutes);
app.use("/api", loginRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
