import Product from "../models/ProductsModel.js";
import Booking from "../models/BookingsModel.js";

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    // Delete all bookings related to this product
    await Booking.deleteMany({ productId });

    res.json({ message: "Product and related bookings deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
