import express from "express";
import multer from "multer";
import Product from "../models/ProductModel.js";

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// POST API to add a new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, transmission, fuelType } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({ name, image: imageUrl, price, transmission, fuelType });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET API to fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
