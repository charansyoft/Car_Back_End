import express from "express";
import User from "../models/UsersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// **Signup Route**
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Received Data:", { username, email, password }); // Log the received data

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup route:", error); // Log the error
    res.status(500).json({ message: "Server error", error });
  }
});




// **Login Route**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set token in HTTP-only cookie
    res.cookie("authToken", token, { httpOnly: true, secure: false, sameSite: "strict" });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// authRoutes.js (logout route)
router.post("/logout", (req, res) => {
  res.clearCookie("authToken"); // Clear the authToken cookie
  res.json({ message: "Logged out successfully" });
});


export default router;