import mongoose from "mongoose";
import Booking from "./BookingsModel.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// 🛑 BEFORE deleting a user, delete all related bookings
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this.getQuery()._id;
    console.log(`🗑 Deleting user ${userId} and their bookings...`);
    
    await Booking.deleteMany({ user: userId });
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;