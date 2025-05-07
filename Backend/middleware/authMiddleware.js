import User from "../models/User.js";
import bcrypt from "bcryptjs";
import session from "express-session";

const MAX_ADMINS = 3;
const ADMIN_CODE = "IWB-ADMIN-2024";

// Middleware to protect routes by checking session
export const protect = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Not authorized, session failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "No session, authorization denied" });
  }
};

// Middleware to check if the user is an admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

// Signup controller
export const signup = async (req, res) => {
  try {
    const { username, email, password, role, adminCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount >= MAX_ADMINS)
        return res.status(403).json({ message: "Admin limit reached." });
      if (adminCode !== ADMIN_CODE)
        return res.status(401).json({ message: "Invalid admin code." });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      // isVerified is removed here since you're not verifying users anymore
    });

    res.status(201).json({ message: "Signup successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove verification logic here
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     message: "Account not verified. Please contact support.",
    //   });
    // }

    req.session.userId = user._id;
    req.session.role = user.role;

    res.status(200).json({
      message: "Login successful",
      isAdmin: user.role === "admin",
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Logout controller
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};

// Get admin count controller
export const getAdminCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch admin count" });
  }
};
