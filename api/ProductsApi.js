import express from "express";
import multer from "multer";
import Product from "../models/ProductsModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { deleteProduct } from "../controllers/ProductsController.js";

const router = express.Router();

// ✅ Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Fetch All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Secure Product Upload with Authentication
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("🔍 Incoming Request Body:", req.body);
    console.log("🔍 Incoming File:", req.file);

    const { name, price, transmission, fuelType } = req.body;

    if (!name || !price || !transmission || !fuelType) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image upload is required!" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const newProduct = new Product({ name, image: imageUrl, price, transmission, fuelType });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });

  } catch (error) {
    console.error("❌ Backend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch a Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ✅ DELETE a product by ID and related bookings
router.delete('/:productId', authMiddleware, deleteProduct);

// ✅ UPDATE a product by ID (EDIT functionality)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Incoming Update Request:", req.params.id, req.body);

    const { name, price, transmission, fuelType } = req.body;

    // ✅ Find the product
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // ✅ Update product fields
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.transmission = transmission ?? product.transmission;
    product.fuelType = fuelType ?? product.fuelType;

    await product.save();
    res.json({ message: "✅ Product updated successfully", product });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
