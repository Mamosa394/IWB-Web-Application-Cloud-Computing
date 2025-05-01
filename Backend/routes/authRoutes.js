import express from "express";
import {
  signup,
  login,
  verifyOTP,
  getAdminCount,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/admin-count", getAdminCount);

export default router;
