import mongoose from "mongoose";
import Booking from "./BookingsModel.js";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  fuelType: String,
  transmission: String,
});

// 🛑 BEFORE deleting a product, delete all related bookings
productSchema.pre("findOneAndDelete", async function (next) {
  try {
    const productId = this.getQuery()._id;
    console.log(`🗑 Deleting product ${productId} and its bookings...`);
    
    await Booking.deleteMany({ productId });
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
