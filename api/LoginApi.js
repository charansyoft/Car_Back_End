import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/UsersModel.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ LOGIN ROUTE
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found. Please sign up first." });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password. Please try again." });
      }

      // ✅ Generate JWT including name & email
      const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
);

// ✅ SIGNUP ROUTE
router.post(
  "/signup",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists. Please log in." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully. Please log in." });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
);

export default router;
