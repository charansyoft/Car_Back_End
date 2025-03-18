import mongoose from "mongoose";
import Booking from "./BookingsModel.js";

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
  {
    _id: { type: Types.ObjectId, auto: true }, // ✅ Ensure _id is an ObjectId
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    transmission: { type: String, enum: ["Auto", "Manual"], required: true },
    fuelType: { type: String, enum: ["Petrol", "Diesel"], required: true },
  },
  { timestamps: true }
);

// ✅ Auto-delete related bookings when a product is deleted
productSchema.pre("findOneAndDelete", async function (next) {
  try {
    const productId = this.getQuery()._id; // Get the ID of the product being deleted
    console.log(`🗑 Deleting product ${productId} and its related bookings...`);

    await Booking.deleteMany({ productId }); // Delete all bookings linked to this product

    next();
  } catch (error) {
    next(error);
  }
});

export default model("Product", productSchema);
