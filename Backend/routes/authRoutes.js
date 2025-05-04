import express from "express";
import { signup, login, getAdminCount } from "../controllers/authController.js";

const router = express.Router();

// Route to sign up a user
router.post("/signup", signup);

// Route to login a user
router.post("/login", login);

// Route to get the count of admins
router.get("/admin-count", getAdminCount);

// Route to get logged-in user's profile (no authentication required)
router.get("/profile", async (req, res) => {
  try {
    // Assume user is logged in and request contains user id
    const user = await User.findById(req.user.id).select("-password"); // This may not work if no authentication logic
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route to access admin dashboard (no authentication)
router.get("/admin-dashboard", (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard!",
  });
});

export default router;
