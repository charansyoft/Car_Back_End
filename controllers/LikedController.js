import LikedModel from "../models/LikedModel.js";

export const likeProduct = async (req, res) => {
  try {
    const { productId, name, price, description, image } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }

    // Check if the product is already liked by the user
    const existingLike = await LikedModel.findOne({
      userId: req.user._id,
      productId,
    });

    if (existingLike) {
      return res.status(400).json({ error: "Product already liked." });
    }

    const likedProduct = new LikedModel({
      userId: req.user._id,
      productId,
      name,
      price,
      description,
      image,
    });

    await likedProduct.save();
    res.status(201).json({ message: "Product liked successfully", likedProduct });
  } catch (error) {
    res.status(500).json({ error: "Error liking product" });
  }
};


export const unlikeProduct = async (req, res) => {
  try {
    const { likeId } = req.params;

    const deletedLike = await LikedModel.findOneAndDelete({
      _id: likeId,
      userId: req.user._id, // Ensure user can only delete their own likes
    });

    if (!deletedLike) {
      return res.status(404).json({ error: "Liked product not found" });
    }

    res.json({ message: "Product unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error unliking product" });
  }
};


export const getLikedProducts = async (req, res) => {
  try {
    console.log("Fetching liked products for user:", req.user); // Debug user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }

    const likedProducts = await LikedModel.find({ userId: req.user._id });
    console.log("Liked Products:", likedProducts); // Debug fetched data

    res.json(likedProducts);
  } catch (error) {
    console.error("Error fetching liked products:", error);
    res.status(500).json({ error: "Failed to fetch liked products" });
  }
};


