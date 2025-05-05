import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import sgMail from "@sendgrid/mail"; // ✅ Add SendGrid

// Import routes
import productRoutes from "./routes/productRoutes.js";
import salesRoute from "./routes/salesRoute.js";
import queryRoutes from "./routes/queryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 5000;

// ✅ MongoDB URI
const MONGO_URI =
  "mongodb+srv://thabopiustlou:tlouthabo@bureau.jkkebcq.mongodb.net/?retryWrites=true&w=majority&appName=BUREAU";

// ✅ SendGrid API Key Setup — Replace with your actual API key
sgMail.setApiKey("SG.YOUR_REAL_API_KEY_HERE"); // 🔁 remember to replace with actual key

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB (deprecated options removed)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to TechStore"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoute);
app.use("/api/client-queries", queryRoutes);
app.use("/api/auth", authRoutes); // The auth routes for signup, login, etc.

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Graceful Shutdown
// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received: closing HTTP server gracefully.");
  mongoose.connection
    .close()
    .then(() => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
