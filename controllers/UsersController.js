import User from "../models/UsersModel.js";
import Booking from "../models/BookingsModel.js";

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    // Delete all bookings related to this user
    await Booking.deleteMany({ userId });

    res.json({ message: "User and related bookings deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
