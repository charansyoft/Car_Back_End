// api/BookingsApi.js

import express from "express";
import Booking from "../models/BookingsModel.js"; // Assuming you have a Booking model

const router = express.Router();

// Create a booking
router.post("/", async (req, res) => {
  try {
    const { productId, title, image, price, fuelType, transmission } = req.body;
    const newBooking = new Booking({
      productId,
      title,
      image,
      price,
      fuelType,
      transmission,
      user: req.user._id, // Assuming user info is in req.user from authentication middleware
    });
    
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get all bookings (optional, if you need to display bookings)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email"); // Adjust according to your User model
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
