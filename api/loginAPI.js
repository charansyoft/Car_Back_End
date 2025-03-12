import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const router = express.Router();

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

import User from "../models/User.js"; // ✅ Works with ES Modules

// Login route
router.post("/", async (req, res) => {
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

export default router;
