import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash the password if it's modified

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass error to next middleware
  }
});

// Instance method to compare hashed password with a given password
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare provided password with hashed password
  } catch (err) {
    throw new Error("Error comparing password"); // Handle error if comparison fails
  }
};

// Static method to check if OTP is expired
userSchema.methods.isOtpExpired = function () {
  return this.otpExpires < Date.now();
};

const User = mongoose.model("User", userSchema);
export default User;
