import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
