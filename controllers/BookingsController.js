import { validationResult } from "express-validator";
import Booking from "../models/BookingsModel.js";
import Product from "../models/ProductsModel.js";
import User from "../models/UsersModel.js";

// ✅ Create a booking
export const createBooking = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, title, image, price, fuelType, transmission } = req.body;
    const userId = req.user._id; // Extracted from authMiddleware

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create new booking
    const newBooking = new Booking({
      user: userId,
      productId,
      title,
      image,
      price,
      fuelType,
      transmission,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").populate("productId", "name image");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get bookings for a specific user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate("productId", "name image");
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
