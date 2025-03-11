import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors"; // Keep only one import
import bodyParser from "body-parser";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

// Enable CORS for all origins (or you can specify specific origins)
app.use(cors());

// Parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI (replace this if you're using MongoDB Atlas or a different URI)
const mongoURI = "mongodb://localhost:27017/myAppDB"; // Updated DB name to reflect both collections

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB:", err));


  
  // Define User Schema for Sign-Up
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique constraint
    password: { type: String, required: true },
  });
  
  const User = mongoose.model("User", userSchema);
  
  // Sign-Up route
  app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already created with this email" });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user in the database
      await newUser.save();
      res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });