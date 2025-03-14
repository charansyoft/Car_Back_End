import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Image URL or path
  price: { type: Number, required: true },
  transmission: { type: String, enum: ["Auto", "Manual"], required: true },
  fuelType: { type: String, enum: ["Petrol", "Diesel"], required: true }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;