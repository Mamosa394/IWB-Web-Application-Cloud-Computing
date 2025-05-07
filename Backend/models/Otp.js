import mongoose from "mongoose";

// Define OTP schema
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensure each email has only one OTP record at a time
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, // To mark whether OTP has been verified
    },
  },
  { timestamps: true } // Automatically tracks when the OTP was created
);

export default mongoose.model("Otp", otpSchema);
