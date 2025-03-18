import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { check, validationResult } from "express-validator";

dotenv.config();

const router = express.Router();

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  gmail: String,
  msg: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// API route to handle contact form submissions
router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("gmail").isEmail().withMessage("Valid email is required"),
    check("msg").notEmpty().withMessage("Message is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { name, gmail, msg } = req.body;

    const newContact = new Contact({ name, gmail, msg });

    try {
      await newContact.save();

      // Nodemailer setup
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>Contact Details</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${gmail}</p>
          <p><b>Message:</b> ${msg}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Message saved and email sent successfully!" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Failed to save message or send email." });
    }
  }
);

export default router;
