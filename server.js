const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all origins (or you can specify specific origins)
app.use(cors());

// Parse JSON data
app.use(bodyParser.json());

// MongoDB connection URI (replace this if you're using MongoDB Atlas or a different URI)
const mongoURI = "mongodb://localhost:27017/myAppDB"; // Updated DB name to reflect both collections

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// -------------------- CONTACT FORM --------------------

// Define the schema for the 'contactus' collection
const contactSchema = new mongoose.Schema({
  name: String,
  gmail: String,
  msg: String,
});

// Create a model for the 'contactus' collection
const Contact = mongoose.model("Contact", contactSchema);

// API route to handle contact form submissions
app.post("/api/contact", async (req, res) => {
  const { name, gmail, msg } = req.body;

  // Create a new contact entry
  const newContact = new Contact({ name, gmail, msg });

  try {
    // Save the contact to MongoDB
    await newContact.save();
    res.status(200).json({ message: "Message saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// -------------------- SIGN-UP FORM --------------------

// Define User Schema for Sign-Up
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Sign-Up route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists." });
  }

  // Hash the password before saving to DB
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// -------------------- LOGIN FORM --------------------

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // If username and password match, send a success response
  res.status(200).json({ message: `Hi ${username}, welcome back!`, user });
});

// Start the Express server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

