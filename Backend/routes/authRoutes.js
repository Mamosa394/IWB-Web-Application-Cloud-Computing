import express from "express";
import {
  signup,
  login,
  verifyOTP,
  getAdminCount,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Route to sign up a user
router.post("/signup", signup);

// Route to verify OTP during signup
router.post("/verify-otp", verifyOTP);

// Route to login a user
router.post("/login", login);

// Route to get the count of admins
router.get("/admin-count", getAdminCount);

// ✅ Protected route to get logged-in user's profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin-only route to access admin dashboard
router.get("/admin-dashboard", protect, adminOnly, (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard!",
  });
});

export default router;
