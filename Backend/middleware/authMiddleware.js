import express from "express";
import { signup, login, getAdminCount } from "../controllers/authController.js";
import User from "../models/User.js"; // Add this if you need to query User

const router = express.Router();

// Route to sign up a user
router.post("/signup", signup);

// Route to login a user
router.post("/login", login);

// Route to get the count of admins (No authentication required for this)
router.get("/admin-count", getAdminCount);

// Route to get logged-in user's profile (Removed authentication, no `req.user`)
router.get("/profile", async (req, res) => {
  try {
    // We don't have `req.user` anymore, so just querying the user by ID (if provided in query)
    const userId = req.query.userId; // Assuming you pass `userId` in query params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route to access the admin dashboard (No authentication required)
router.get("/admin-dashboard", (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard!",
  });
});

export default router;
