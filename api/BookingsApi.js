import express from "express";
import Booking from "../models/BookingsModel.js";

const router = express.Router();


// GET all bookings
router.get("/", async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });
  

// POST a new booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
