import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, productId, startDate, endDate, totalPrice } = req.body;

    // Validate product availability
    const product = await Product.findById(productId);
    if (!product || !product.available) {
      return res.status(400).json({ message: "Car is not available for booking" });
    }

    const order = new Order({
      user: userId,
      product: productId,
      startDate,
      endDate,
      totalPrice,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});

// Get orders by user ID
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
