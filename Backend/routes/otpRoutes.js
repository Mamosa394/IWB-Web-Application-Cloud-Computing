import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";

const router = express.Router();

// Route to send OTP
router.post("/send-otp", sendOTP);

// Route to verify OTP
router.post("/verify-otp", verifyOTP);

export default router;
