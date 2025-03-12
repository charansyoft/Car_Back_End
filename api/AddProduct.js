import express from "express";
import Product from "../models/ProductModel.js";

const router = express.Router();

// Add a Product (POST request)
router.post("/", async (req, res) => {
  try {
    const { title, seats, price } = req.body;

    if (!title || !seats || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ title, seats, price });
    await newProduct.save();

    return res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
