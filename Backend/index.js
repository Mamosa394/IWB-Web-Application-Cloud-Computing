import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo"; // Store sessions in MongoDB
import authRoutes from "./routes/authRoutes.js"; // Updated auth routes
import otpRoutes from "./routes/otpRoutes.js"; // Updated OTP routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-random-secret", // Use a secret key for session encryption
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true for HTTPS
      httpOnly: true, // Helps to prevent XSS attacks
      maxAge: 1000 * 60 * 60, // Session expiration time (1 hour)
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection string
      collectionName: "sessions", // Store sessions in the "sessions" collection
    }),
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes); // New OTP route

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
