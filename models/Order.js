import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product model
  startDate: { type: Date, required: true }, // Rental start date
  endDate: { type: Date, required: true }, // Rental end date
  totalPrice: { type: Number, required: true }, // Total booking price
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" }, // Order status
  createdAt: { type: Date, default: Date.now }, // Order creation timestamp
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
