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




  
  // Define the schema for the 'ContactUs' collection
  const contactSchema = new mongoose.Schema({
    name: String,
    gmail: String,
    msg: String,
  });
  
  // Create a model for the 'ContactUs' collection
  const Contact = mongoose.model("Contact", contactSchema);
  
  // API route to handle contact form submissions
  app.post("/api/contact", async (req, res) => {
    const { name, gmail, msg } = req.body;
  
    // Create a new contact entry
    const newContact = new Contact({ name, gmail, msg });
  
    try {
      // Save the contact to MongoDB
      await newContact.save();
  
      // Step 1: Create a transporter
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Your Gmail
          pass: process.env.EMAIL_PASS, // Your App Password
        },
      });
  
      // Step 2: Define mail options
      let mailOptions = {
        from: process.env.EMAIL, // Sender's email
        to: process.env.EMAIL, // Your email
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>Contact Details</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${gmail}</p>
          <p><b>Message:</b> ${msg}</p>
        `,
      };
  
      // Step 3: Send the email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Message saved and email sent successfully!" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Failed to save message or send email." });
    }
  });