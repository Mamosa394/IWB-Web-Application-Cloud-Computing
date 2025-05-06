import express from "express";
import { signup, login, getAdminCount } from "../controllers/authController.js";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/admin-count", getAdminCount);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
