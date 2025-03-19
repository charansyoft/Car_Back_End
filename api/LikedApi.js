import express from "express";
import { likeProduct, unlikeProduct, getLikedProducts } from "../controllers/LikedController.js";
import protect from "../middleware/authMiddleware.js"; // Ensure middleware is correctly imported

const router = express.Router();

router.get("/", protect, getLikedProducts);  // Fetch liked products
router.post("/", protect, likeProduct);  // Like a product
router.delete("/:likeId", protect, unlikeProduct);  // Unlike a product

export default router;
