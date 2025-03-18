import Booking from "../models/BookingModel.js";
import User from "../models/UsersModel.js";
import Product from "../models/ProductModel.js";

export const createBooking = async (req, res) => {
  try {
    const { userId, productId, title, image, price, fuelType, transmission } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    // Check if the product exists
    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: "Product not found" });

    // Create booking
    const newBooking = new Booking({
      userId,
      productId,
      title,
      image,
      price,
      fuelType,
      transmission
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
