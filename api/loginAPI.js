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

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: `Welcome back, ${user.username}!` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
