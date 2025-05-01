import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

const upload = multer({ storage });

const app = express();

app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(uploadDir));

/**
 * @route POST /api/products
 * @desc Create a new product
 */
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, type, cpu, ram, storage, gpu, price, status, tags } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      type,
      specs: { cpu, ram, storage, gpu },
      price,
      image,
      status,
      tags,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route GET /api/products
 * @desc Fetch all products
 */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /api/products/:id
 * @desc Update a product by ID
 */
app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route DELETE /api/products/:id
 * @desc Delete a product by ID
 */
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
