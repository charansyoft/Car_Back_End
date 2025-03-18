import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import { createBooking, getUserBookings, getAllBookings } from "../controllers/BookingsController.js";

const router = express.Router();

// ✅ Create a booking (User must be authenticated)
router.post(
  "/",
  authMiddleware,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("image").notEmpty().withMessage("Image URL is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("fuelType").notEmpty().withMessage("Fuel type is required"),
    body("transmission").notEmpty().withMessage("Transmission type is required"),
  ],
  createBooking
);

// ✅ Get all bookings (Admin only)
router.get("/", authMiddleware, getAllBookings);

// ✅ Get bookings for a specific user
router.get("/user", authMiddleware, getUserBookings);

export default router;
