import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import productRoutes from "./routes/productRoutes.js";
import salesRoute from "./routes/salesRoute.js";
import queryRoutes from "./routes/queryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to TechStore"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoute);
app.use("/api/client-queries", queryRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
