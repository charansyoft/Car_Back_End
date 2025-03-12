import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import contactRoutes from "./api/contactAPI.js";
import signupRoutes from "./api/signupAPI.js";
import loginRoutes from "./api/loginAPI.js";
import productRoutes from "./api/AddProduct.js"; // Ensure .js is included// import orderRoutes from "./api/orderAPI.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS and parse JSON data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/myAppDB";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// API routes
app.use("/api/contact", contactRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
